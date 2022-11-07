import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { testGroupMessages, usersList } from '../../../shared/test-data/data-source';
import { IonContent } from '@ionic/angular';
import { splitMessagesIntoGroups } from '../../../shared/functions/split-messages-into-groups';

@Component({
  selector: 'app-room-end-side',
  templateUrl: './room-end-side.component.html',
  styleUrls: ['./room-end-side.component.scss'],
})
export class RoomEndSideComponent implements OnInit, AfterViewInit {
  @ViewChild('currentChatContent')
  private readonly chatContent: IonContent;

  public messages = splitMessagesIntoGroups(testGroupMessages).map(
    group => ({
      ...group,
      user: usersList.find(user => user.id === group.from)
    })
  );

  constructor() { }

  ngOnInit(): void {
    splitMessagesIntoGroups(this.messages);
  }

  async ngAfterViewInit(): Promise<void> {
    await this.chatContent.scrollToBottom(0);
  }

}
