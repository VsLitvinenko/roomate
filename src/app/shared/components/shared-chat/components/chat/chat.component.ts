import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { Observable } from 'rxjs';
import { differenceInHours, isSameDay, startOfDay } from 'date-fns';
import groupBy from 'lodash-es/groupBy';
import { ChatMessage, UserInfo, UsersService } from 'src/app/core';

interface MesGroup {
  messages: ChatMessage[];
  user$: Observable<UserInfo>;
  self: boolean;
}

export interface ChatInfiniteScrollEvent {
  side: 'top' | 'bottom';
  event: any;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnChanges {
  @Input() public topScrollDisabled: boolean;
  @Input() public bottomScrollDisabled: boolean;
  @Input() public messages: ChatMessage[];

  @Output() public infiniteScroll = new EventEmitter<ChatInfiniteScrollEvent>();
  // type fix for understanding by IDE
  public messageDays: Record<number, MesGroup[]>;

  constructor(private readonly users: UsersService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.messages && this.messages) {
      this.messageDays = groupBy(
        this.splitMessagesIntoGroups(),
        group =>  startOfDay(new Date(group.messages[0].timestamp)).getTime()
      );
    }
  }

  public trackByDay(index, item: { key: string; value: MesGroup[] }): string {
    return item.key;
  }

  public trackByGroup(index, item: MesGroup): string {
    return item.messages.reduce(
      (res, mes) => res += mes.content, ''
    ) + item.messages.at(-1).id;
  }

  private splitMessagesIntoGroups(): MesGroup[] {
    return this.messages.reduce((res, item, index, arr) => {
      if (
        (index === 0) ||
        (item.senderId !== arr[index - 1].senderId) ||
        !isSameDay(
          new Date(item.timestamp),
          new Date(arr[index - 1].timestamp),
        ) ||
        differenceInHours(
          new Date(arr[index - 1].timestamp),
          new Date(item.timestamp)
        ) > 0
      ) {
        res.push({
          messages: [item],
          self: this.users.selfId === item.senderId,
          user$: this.users.getUser(item.senderId),
        });
      }
      else {
        res.at(-1).messages.push(item);
      }
      return res;
    }, [] as MesGroup[]);
  }

}
