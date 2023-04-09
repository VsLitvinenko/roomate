import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  BehaviorSubject,
  debounceTime,
  Subject,
  take,
  switchMap,
  map,
  lastValueFrom,
  filter,
} from 'rxjs';
import { ChatMessage } from '../../../core';
import { isAppFullWidth$ } from '../../common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LocalizationService } from '../../localization';
import { InfiniteScrollEvent, SharedInfiniteContentComponent } from '../shared-infinite-content';

interface BotMesLoadedEvent {
  prevLastBottomMessageId: number;
  newLastBottomMessageId: number;
  prevLength: number;
  newLength: number;
}

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-shared-chat',
  templateUrl: './shared-chat.component.html',
  styleUrls: ['./shared-chat.component.scss'],
})
export class SharedChatComponent implements OnChanges {
  @Input() public messages: ChatMessage[];
  @Input() public isTopMesLimitAchieved: boolean;
  @Input() public isBottomMesLimitAchieved: boolean;
  @Input() public lastReadMessageId: number;

  @Output() public infiniteScroll = new EventEmitter<InfiniteScrollEvent>();

  @ViewChild(SharedInfiniteContentComponent) infiniteContent: SharedInfiniteContentComponent;

  public mutableContainer$ = new BehaviorSubject<HTMLElement>(undefined);
  public readonly loading$ = new BehaviorSubject<boolean>(true);

  private readonly newBottomMessagesLoaded$ = new Subject<BotMesLoadedEvent>();

  private readonly newMessagesBar = this.createNewMessagesBarElement();
  private readonly readMessagesObserver = this.createReadMessagesObserver();

  private readonly readMessageEvent$ = new Subject<number>();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  @Output() public readonly updateLastReadMessage = this.readMessageEvent$.pipe(
    debounceTime(100)
  );

  constructor(private readonly localizationService: LocalizationService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.messages &&
      changes.messages.previousValue &&
      changes.messages.currentValue?.length &&
      changes.messages.previousValue.at(0)?.id !== changes.messages.currentValue.at(0).id
    )
    {
      if (changes.messages.currentValue.at(0).id === null) {
        this.infiniteContent.scrollToBottom(200).then();
      }
      else {
        const reallyPrevValue = changes.messages.previousValue.at(0)?.id === null ?
          changes.messages.previousValue.slice(1) // delete temp message
          : changes.messages.previousValue;
        this.newBottomMessagesLoaded$.next({
          prevLastBottomMessageId: reallyPrevValue.at(0)?.id ?? null,
          newLastBottomMessageId: changes.messages.currentValue.at(0).id,
          prevLength: reallyPrevValue.length,
          newLength: changes.messages.currentValue.length
        });
      }
    }
  }

  public onIonContentScrollReady(el: HTMLElement): void {
    // scroll bottom on new message
    this.newBottomMessagesLoaded$.pipe(
      filter(event => (event.newLength - event.prevLength) === 1),
      filter(() => el.scrollHeight - (el.scrollTop + el.clientHeight) < 10),
      untilDestroyed(this)
    ).subscribe(() => this.infiniteContent.scrollToBottom(200));
  }

  public getCurrentScrollPoint(): number {
    return this.infiniteContent.scrollElement.scrollTop;
  }

  public firstMessagesLoaded(parentContainer: HTMLElement): void {
    this.mutableContainer$.next(parentContainer);
    this.checkView(parentContainer, true)
      .then(() => this.loading$.next(false));
  }

  public recheckView(scrollToPoint: number): void {
    this.newMessagesBar.remove();
    this.infiniteContent.scrollToPoint(scrollToPoint, 0)
      .then(() => this.checkView(this.mutableContainer$.value, false));
  }

  private async checkView(parentContainer: HTMLElement, initial: boolean): Promise<void> {
    if (
      this.messages.length === 0 ||
      this.lastReadMessageId === this.messages[0].id
    ) {
      // all messages are already read
      if (initial) {
        await this.infiniteContent.scrollToBottom(0);
        this.waitNewRenderedBottomMessages().then(event => {
          const newMessage = parentContainer.querySelector(`#message-${event.newLastBottomMessageId}`);
          this.readMessagesObserver.observe(newMessage);
        });
      }
    }
    else if (!this.lastReadMessageId) {
      // no read any messages at all
      const firstMessage = parentContainer.firstElementChild // first day
        .lastElementChild.previousElementSibling // first group
        .lastElementChild; // first message
      const mesEl = await this.getNextNonVisibleMessage(firstMessage);
      this.readMessagesObserver.observe(mesEl);
    }
    else {
      // find last read message
      const msgEl: HTMLElement = parentContainer.querySelector(`#message-${this.lastReadMessageId}`);
      if (!msgEl) {
        console.error('chat error: cant find lastReadMessage element');
        return;
      }
      if (initial) {
        const newMessage = await this.getNextNonVisibleMessage(msgEl);
        this.readMessagesObserver.observe(newMessage);
      }
      msgEl.before(this.newMessagesBar);
      if (initial) {
        this.newMessagesBar.scrollIntoView({ block: 'center' });
      }
    }
  }

  private createNewMessagesBarElement(): HTMLElement {
    const newMessagesEl = document.createElement('div');
    newMessagesEl.innerHTML = `<span>${this.localizationService.localize('newMessages')}</span>`;

    isAppFullWidth$.pipe(
      untilDestroyed(this)
    ).subscribe(fullWidth => {
      if (fullWidth) {
        newMessagesEl.className = 'new-messages-bar';
      }
      else {
        newMessagesEl.className = 'new-messages-bar mobile-bar';
      }
    });
    return newMessagesEl;
  }

  private createReadMessagesObserver(): IntersectionObserver {
    const handler = (entries, observer) => {
      entries = entries.filter(item => item.isIntersecting);
      if (entries.length === 0) {
        return;
      }
      const el = entries[0].target;
      observer.unobserve(el);
      this.getNextNonVisibleMessage(el).then(newMesEl => observer.observe(newMesEl));
    };

    return new IntersectionObserver(handler, {
      threshold: 1,
      rootMargin: '-150px 0px 0px 0px'
    });
  }

  private async getNextNonVisibleMessage(prevMes: Element | any): Promise<Element> {
    // read message
    this.readMessageEvent$.next(Number(prevMes.id.slice(8)));
    let nextMessage: Element;
    if (prevMes.previousElementSibling?.hasAttribute('message')) {
      // message in same group
      nextMessage = prevMes.previousElementSibling;
    }
    else if (prevMes.parentElement.previousElementSibling?.tagName === 'APP-MESSAGES-GROUP') {
      // message in next group if exist
      nextMessage = prevMes.parentElement.previousElementSibling.lastElementChild;
    }
    else if (prevMes.parentElement.parentElement.nextElementSibling?.hasAttribute('messageDay')) {
      // message in first group of next day if exist
      nextMessage = prevMes.parentElement.parentElement.nextSibling // next day
        .lastElementChild.previousElementSibling // first message group
        .lastElementChild; // first message
    }
    else {
      // wait new rendered messages
      const event = await this.waitNewRenderedBottomMessages();
      const prevMessage = this.messages.find(item => item.id === event.prevLastBottomMessageId);
      const prevMessageElement = this.mutableContainer$.value.querySelector(`#message-${prevMessage.id}`);
      return this.getNextNonVisibleMessage(prevMessageElement);
    }
    const bottomPos = nextMessage.getBoundingClientRect().bottom;
    const parent = await this.infiniteContent.scrollElementAsync;
    if (parent.clientHeight < bottomPos) {
      // not visible
      return nextMessage;
    }
    else {
      // this message is already visible, get next one
      return this.getNextNonVisibleMessage(nextMessage);
    }
  }

  private waitNewRenderedBottomMessages(): Promise<BotMesLoadedEvent> {
    const newBottomMessagesRendered$ = this.newBottomMessagesLoaded$.pipe(
      take(1),
      switchMap(mesLoadedEvent => this.mutableContainer$.pipe(
        take(1),
        map(() => mesLoadedEvent)
      ))
    );
    return lastValueFrom(newBottomMessagesRendered$);
  }

}
