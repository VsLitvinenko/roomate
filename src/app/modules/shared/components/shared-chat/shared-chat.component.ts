import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { Message } from '../../../../api/channels-api';
import { UsersStoreService } from '../../../../stores/users-store.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/api/users-api';
import { isSameDay, startOfDay } from 'date-fns';
import { difference, groupBy } from 'lodash-es';

interface MesGroup {
  messages: Message[];
  senderId: number;
  user$: Observable<User>;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-shared-chat',
  templateUrl: './shared-chat.component.html',
  styleUrls: ['./shared-chat.component.scss'],
})
export class SharedChatComponent implements OnChanges {
  @Input() public scrollEnabled: boolean;
  @Input() public messages: Message[];

  @Output() public infiniteScroll = new EventEmitter();
  public messageDays = new Map<number, MesGroup[]>();

  constructor(private readonly usersStore: UsersStoreService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.messages && this.messages) {
      const difMessages: Message[] = difference(
        changes.messages.currentValue,
        changes.messages.previousValue,
      );
      this.updateMesDays(difMessages);
    }
  }

  public trackByDay(index, item: { key; value }): number {
    return item.key;
  }

  private updateMesDays(difMessages: Message[]): void {
    const difGroups = groupBy(
      this.splitMessagesIntoGroups(difMessages),
      group =>  startOfDay(new Date(group.messages[0].timestamp)).getTime()
    );
    Object.keys(difGroups).forEach(key => {
      const day = parseInt(key, 10);
      if (this.messageDays.has(day)) {
        // update existing day
        const existDay = this.messageDays.get(day);
        if (existDay[existDay.length - 1].senderId === difGroups[day][0].senderId) {
          // update existing message group instead creating new one
          existDay[existDay.length - 1].messages = [
            ...existDay[existDay.length - 1].messages,
            ...difGroups[day][0].messages
          ];
          difGroups[day].splice(0, 1);
        }
        // update day with really new groups
        this.messageDays.set(day, [
          ...existDay,
          ...difGroups[day]
        ]);
      }
      else {
        this.messageDays.set(day, difGroups[day]);
      }
    });
  }

  private splitMessagesIntoGroups(difMessages: Message[]): MesGroup[] {
    return difMessages.reduce((res, item, index, arr) => {
      if (
        (index === 0) ||
        (item.senderId !== arr[index - 1].senderId) ||
        !isSameDay(
          new Date(item.timestamp),
          new Date(arr[index - 1].timestamp),
        )
      ) {
        res.push({
          messages: [item],
          senderId: item.senderId,
          user$: this.usersStore.getUser(item.senderId)
        });
      }
      else {
        res[res.length - 1].messages.push(item);
      }
      return res;
    }, [] as MesGroup[]);
  }

}
