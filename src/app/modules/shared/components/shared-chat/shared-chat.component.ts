import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Message } from '../../../../api/channels-api';
import { UsersStoreService } from '../../../../stores/users-store.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/api/users-api';

@Component({
  selector: 'app-shared-chat',
  templateUrl: './shared-chat.component.html',
  styleUrls: ['./shared-chat.component.scss'],
})
export class SharedChatComponent implements OnChanges {
  @Input() public scrollEnabled: boolean;
  @Input() public messages: Message[];

  @Output() public infiniteScroll = new EventEmitter();
  public messageGroups: {
    messages: Message[];
    user$: Observable<User>;
  }[];

  constructor(private readonly usersStore: UsersStoreService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.messages && this.messages) {
      this.messageGroups = this.splitMessagesIntoGroups().map(
        group => ({
          ...group,
          user$: this.usersStore.getUser(group.senderId)
        })
      );
    }
  }

  public trackByGroup(index, item): string {
    return item.messages[0].id + item.messages.at(-1).id;
  }

  private splitMessagesIntoGroups(): { senderId: number; messages: Message[] }[] {
    return this.messages.reduce((res, item, index, arr) => {
      if (
        (index === 0) ||
        (item.senderId !== arr[index - 1].senderId)
      ) {
        res.push({
          messages: [item],
          senderId: item.senderId
        });
      }
      else {
        res[res.length - 1].messages.push(item);
      }
      return res;
    }, []);
  }

}
