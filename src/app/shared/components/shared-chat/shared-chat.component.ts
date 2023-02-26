import {
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
import { BehaviorSubject } from 'rxjs';
import { ChatMessage, UsersService } from '../../../core';
import { IonContent } from '@ionic/angular';
import { promiseDelay } from '../../common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-shared-chat',
  templateUrl: './shared-chat.component.html',
  styleUrls: ['./shared-chat.component.scss'],
})
export class SharedChatComponent implements OnChanges {
  @Input() messages: ChatMessage[];
  @Input() isTopMesLimitAchieved: boolean;
  @Output() public infiniteScroll = new EventEmitter();

  @ViewChild('currentChatContent', { static: true }) private readonly chatContent: IonContent;
  public readonly loading$ = new BehaviorSubject<boolean>(true);
  constructor(private readonly users: UsersService) {
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes.messages &&
      !Boolean(changes.messages.previousValue) &&
      Boolean(changes.messages.currentValue)) {
      this.firstMessagesLoaded();
    }
    else if (changes.messages.previousValue && await this.needToScrollDown(changes.messages)) {
      await this.chatContent.scrollToBottom(200);
    }
  }

  private firstMessagesLoaded(): void {
    promiseDelay(10)
      .then(() => this.chatContent.scrollToBottom(0))
      .then(() => this.loading$.next(false));
  }

  private async needToScrollDown(mesChanges: SimpleChange): Promise<boolean> {
    const el = await this.chatContent.getScrollElement();
    if (el.scrollHeight > el.clientHeight) {
      const oneNewMessage = mesChanges.currentValue.length - mesChanges.previousValue.length === 1;
      const selfMessage =  mesChanges.currentValue[0].senderId === this.users.selfId;
      const nearToBottom = el.scrollHeight - (el.scrollTop + el.clientHeight) < 10;
      return oneNewMessage && (selfMessage || nearToBottom);
    }
    else {
      return false;
    }
  }

}
