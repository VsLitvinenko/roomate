import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { BehaviorSubject, Observable, debounceTime } from 'rxjs';
import { ChatMessage } from '../../../core';
import { filterVisibleElements, isAppFullWidth$, openElementsChildren } from '../../common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LocalizationService } from '../../localization';
import { InfiniteScrollEvent, SharedInfiniteContentComponent } from '../shared-infinite-content';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-shared-chat',
  templateUrl: './shared-chat.component.html',
  styleUrls: ['./shared-chat.component.scss'],
})
export class SharedChatComponent implements OnChanges, AfterViewInit {
  @Input() public messages: ChatMessage[];
  @Input() public isTopMesLimitAchieved: boolean;
  @Input() public isBottomMesLimitAchieved: boolean;
  @Input() public lastReadMessageId: number;

  @Output() public infiniteScroll = new EventEmitter<InfiniteScrollEvent>();
  @Output() public updateLastReadMessage = new EventEmitter<number>();

  @ViewChild(SharedInfiniteContentComponent) infiniteContent: SharedInfiniteContentComponent;

  // can be changed outside this component
  public ignoreNgOnChanges = false;

  public isNotNearToBottom$: Observable<boolean>;
  public mutableContainer$ = new BehaviorSubject<HTMLElement>(undefined);
  public readonly loading$ = new BehaviorSubject<boolean>(true);

  private readonly newMessagesBar = this.createNewMessagesBarElement();

  constructor(private readonly localizationService: LocalizationService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.ignoreNgOnChanges ||
      !changes.messages ||
      !changes.messages.currentValue
    ) {
      // no changes or still don't have any messages
      return;
    }

    if (
      changes.messages.currentValue.length &&
      this.needToReadMessageCauseNoScroll(changes.messages)
    ) {
      this.updateLastReadMessage.emit(this.messages[0].id);
    }
    else if (
      changes.messages.currentValue.length &&
      changes.messages.previousValue &&
      this.needToScrollDownOnNewMessage(changes.messages)
    ) {
      this.infiniteContent.scrollToBottom(200).then();
    }
  }

  ngAfterViewInit(): void {
    // this.chatContent.getScrollElement().then(el => {
    //   this.ionContentScrollElement = el;
    //   this.isNotNearToBottom$ = this.chatContent.ionScroll.pipe(
    //     auditTime(500),
    //     map(() => el.scrollHeight - (el.scrollTop + el.clientHeight) > 200)
    //   );
    // });
    //
    this.infiniteContent.ionScroll.pipe(
      debounceTime(500),
      untilDestroyed(this)
    ).subscribe(event => this.ionScroll(event));
  }

  public getCurrentScrollPoint(): number {
    return this.infiniteContent.scrollElement.scrollTop;
  }

  public firstMessagesLoaded(parentContainer: HTMLElement): void {
    this.mutableContainer$.next(parentContainer);
    this.checkView(parentContainer, true);
    this.loading$.next(false);
  }

  public recheckView(scrollToPoint: number): void {
    this.newMessagesBar.remove();
    this.infiniteContent.scrollToPoint(scrollToPoint, 0)
      .then(() => this.checkView(this.mutableContainer$.value, false));
  }

  private checkView(parentContainer: HTMLElement, doScroll: boolean): void {
    if (!this.lastReadMessageId) {
      // do nothing
    }
    else if (this.lastReadMessageId === this.messages[0].id) {
      if (doScroll) {
        this.infiniteContent.scrollToBottom(0).then();
      }
    }
    else {
      // scroll to last read message
      const msgEl: HTMLElement = parentContainer.querySelector(`#message-${this.lastReadMessageId}`);
      if (!msgEl) {
        return;
      }
      msgEl.before(this.newMessagesBar);
      if (doScroll) {
        this.newMessagesBar.scrollIntoView({ block: 'center' });
      }
    }
  }

  private ionScroll(event: any): void {
    const visibleDays = filterVisibleElements(
      Array.from(this.mutableContainer$.value.children) as HTMLElement[],
      event.target
    );
    const visibleGroups = filterVisibleElements(
      openElementsChildren(visibleDays, { filterHandler: item => item.tagName === 'APP-MESSAGES-GROUP', reverseLeaf: true }),
      event.target
    );
    const visibleMessages = filterVisibleElements(
      openElementsChildren(visibleGroups, { reverseLeaf: true }),
      event.target
    );
    // message element id format is 'message-{id}'
    const lastId = Number(visibleMessages.at(-1).id.slice(8));
    // todo check later messages by timestamp
    if (lastId > this.lastReadMessageId) {
      this.updateLastReadMessage.emit(lastId);
    }
  }

  private needToScrollDownOnNewMessage(mesChanges: SimpleChange): boolean {
    const el = this.infiniteContent.scrollElement;
    if (el && el.scrollHeight > el.clientHeight) {
      const oneNewMessage = mesChanges.currentValue.length - mesChanges.previousValue.length === 1;
      const lastMessageUpdated = mesChanges.currentValue[0].id !== mesChanges.previousValue[0].id;
      const selfMessage =  mesChanges.currentValue[0].id === null; // self temp-message
      const nearToBottom = el.scrollHeight - (el.scrollTop + el.clientHeight) < 10;
      return oneNewMessage && lastMessageUpdated && (selfMessage || nearToBottom);
    }
    else {
      return false;
    }
  }

  private needToReadMessageCauseNoScroll(mesChanges: SimpleChange): boolean {
    const el = this.infiniteContent?.scrollElement;
    const isScrollExist = el && el.scrollHeight > el.clientHeight;
    return !isScrollExist &&
      mesChanges.currentValue[0].id !== null && // skip temp messages
      mesChanges.currentValue[0].id > this.lastReadMessageId; // todo check later messages by timestamp
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

}
