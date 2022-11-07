import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { testGroupMessages } from '../../../shared/test-data/data-source';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-room-end-side',
  templateUrl: './room-end-side.component.html',
  styleUrls: ['./room-end-side.component.scss'],
})
export class RoomEndSideComponent implements OnInit, AfterViewInit {
  @ViewChild('currentChatContent')
  private readonly chatContent: IonContent;

  public messages = testGroupMessages;

  constructor() { }

  ngOnInit(): void {
  }

  async ngAfterViewInit(): Promise<void> {
    await this.chatContent.scrollToBottom(0);
  }

}
