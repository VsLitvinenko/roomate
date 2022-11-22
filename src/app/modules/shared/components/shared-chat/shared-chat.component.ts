import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-shared-chat',
  templateUrl: './shared-chat.component.html',
  styleUrls: ['./shared-chat.component.scss'],
})
export class SharedChatComponent implements OnInit {
  @Input() public scrollEnabled: boolean;
  @Input() public messages: any[];

  @Output() public infiniteScroll = new EventEmitter();

  constructor() { }

  public get messageGroups(): any[] {
    return this.splitMessagesIntoGroups().map(
      group => ({
        ...group,
        user: null
      })
    );
  }

  ngOnInit(): void {}

  private splitMessagesIntoGroups(): any[] {
    return this.messages.reduce((res, item, index, arr) => {
      if (
        (index === 0) ||
        (item.from !== arr[index - 1].from)
      ) {
        res.push({
          messages: [item],
          from: item.from
        });
      }
      else {
        res[res.length - 1].messages.push(item);
      }
      return res;
    }, []);
  }

}
