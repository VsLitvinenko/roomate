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
import { UsersService } from '../../services/users.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/api/users-api';
import { isSameDay, startOfDay } from 'date-fns';
import groupBy from 'lodash-es/groupBy';

interface MesGroup {
  messages: Message[];
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
  // type fix for understanding by IDE
  public messageDays: { [time: number]: MesGroup[] } | ReadonlyMap<number, MesGroup[]>;

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

  public trackByDay(index, item: { key; value }): number {
    return item.key;
  }

  public trackByGroup(index, item: MesGroup): string {
    return `${item.messages[0].id}${item.messages.at(-1).id}`;
  }

  private splitMessagesIntoGroups(): MesGroup[] {
    return this.messages.reduce((res, item, index, arr) => {
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
          user$: this.users.getUser(item.senderId)
        });
      }
      else {
        res.at(-1).messages.push(item);
      }
      return res;
    }, []);
  }

}
