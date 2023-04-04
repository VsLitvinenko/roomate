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
import { BehaviorSubject, Observable, auditTime, debounceTime, map } from 'rxjs';
import { ChatMessage } from '../../../core';
import { IonContent } from '@ionic/angular';
import { filterVisibleElements, isAppFullWidth$, openElementsChildren, promiseDelay } from '../../common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ChatInfiniteScrollEvent } from './components/chat/chat.component';
import { LocalizationService } from '../../localization';

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

  @Output() public infiniteScroll = new EventEmitter<ChatInfiniteScrollEvent>();
  @Output() public updateLastReadMessage = new EventEmitter<number>();

  @ViewChild('currentChatContent', { static: true }) private readonly chatContent: IonContent;

  public readonly loading$ = new BehaviorSubject<boolean>(true);
  public isNotNearToBottom$: Observable<boolean>;

  private ionContentScrollElement: HTMLElement;
  private readonly newMessagesBar = this.createNewMessagesBarElement();

  constructor(private readonly localizationService: LocalizationService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!(
      changes.messages &&
      changes.messages.currentValue
    )) {
      // no changes or still don't have any messages
      return;
    }

    if (!changes.messages.previousValue) {
      this.firstMessagesLoaded();
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
      this.chatContent.scrollToBottom(200).then();
    }
  }

  ngAfterViewInit(): void {
    this.chatContent.scrollEvents = true;

    this.chatContent.getScrollElement().then(el => {
      this.ionContentScrollElement = el;
      this.isNotNearToBottom$ = this.chatContent.ionScroll.pipe(
        auditTime(500),
        map(() => el.scrollHeight - (el.scrollTop + el.clientHeight) > 200)
      );
    });

    this.chatContent.ionScroll.pipe(
      debounceTime(500),
      untilDestroyed(this)
    ).subscribe(event => this.ionScroll(event));
  }

  private ionScroll(event: any): void {
    const visibleDays = filterVisibleElements(
      [...event.target.lastChild.lastChild.children],
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
    const lastId = Number(visibleMessages.at(-1).id);
    // todo check later messages by timestamp
    if (lastId > this.lastReadMessageId) {
      this.updateLastReadMessage.emit(lastId);
    }
  }

  private firstMessagesLoaded(): void {
    promiseDelay(10)
      .then(() => {
        if (!this.lastReadMessageId) {
          // do nothing, should keep scroll on top
          return;
        }
        else if (this.lastReadMessageId === this.messages[0].id) {
          // all messages were read
          return this.chatContent.scrollToBottom(0);
        }
        else {
          // scroll to last read message
          const msgEl = document.getElementById(String(this.lastReadMessageId));
          msgEl.before(this.newMessagesBar);

          const msgPos = msgEl.getBoundingClientRect().bottom;
          const parentHeight = this.ionContentScrollElement.clientHeight;
          return this.chatContent.scrollToPoint(null, msgPos - parentHeight/2, 0);
        }
      })
      .then(() => this.loading$.next(false));
  }

  private needToScrollDownOnNewMessage(mesChanges: SimpleChange): boolean {
    const el = this.ionContentScrollElement;
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
    const el = this.ionContentScrollElement;
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
