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
import { filterVisibleElements, openElementsChildren, promiseDelay } from '../../common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

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
  @Output() public infiniteScroll = new EventEmitter<any>();
  @Output() public updateLastReadMessage = new EventEmitter<number>();
  @ViewChild('currentChatContent', { static: true }) private readonly chatContent: IonContent;

  public readonly loading$ = new BehaviorSubject<boolean>(true);
  public isNotNearToBottom$: Observable<boolean>;

  private ionContentScrollElement: HTMLElement;
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.messages &&
      Boolean(changes.messages.currentValue) &&
      !Boolean(changes.messages.previousValue)
    ) {
      this.firstMessagesLoaded();
    }
    else if (
      Boolean(changes.messages.currentValue?.length) &&
      Boolean(changes.messages.previousValue) &&
      this.needToScrollDown(changes.messages)
    ) {
      this.chatContent.scrollToBottom(200).then();
    }
    else if (
      Boolean(changes.messages.currentValue?.length) &&
      Boolean(changes.messages.previousValue) &&
      this.needToReadMessageCauseNoScroll(changes.messages)
    ) {
      this.updateLastReadMessage.emit(this.messages[0].id);
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
      debounceTime(400),
      untilDestroyed(this)
    ).subscribe(event => this.ionScroll(event));
  }

  public ionScroll(event: any): void {
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
    console.log(visibleMessages);
  }

  private firstMessagesLoaded(): void {
    promiseDelay(10) // smooth render time
      .then(() => this.chatContent.scrollToBottom(0))
      .then(() => this.loading$.next(false));
  }

  private needToScrollDown(mesChanges: SimpleChange): boolean {
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
    const isScrollExist = el.scrollHeight > el.clientHeight;
    // todo читать сообщения, когда их мало в чате, и скролла еще нет
    return true;
  }

}
