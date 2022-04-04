import {Component, OnInit, ViewChild} from '@angular/core';
import { testMessages, usersList } from './data-source';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-room-end-side',
  templateUrl: './room-end-side.component.html',
  styleUrls: ['./room-end-side.component.scss'],
})
export class RoomEndSideComponent implements OnInit {
  @ViewChild('currentChatContent')
  private readonly chatContent: IonContent;

  public messages = testMessages.map(msg => ({
    ...msg,
    user: usersList.find(user => user.id === msg.from)
  }));

  constructor() { }

  ngOnInit() {
    setTimeout(() => this.chatContent.scrollToBottom(0), 1);
  }

}
