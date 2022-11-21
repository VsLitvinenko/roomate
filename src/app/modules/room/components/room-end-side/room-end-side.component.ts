import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { testGroupMessages } from '../../../../api/data-source';
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

  ngAfterViewInit(): void {
    const resizeContentObserver = new ResizeObserver(entries => {
      const contentClientHeight = entries[0].target.clientHeight;
      // ionContent truly initialized (end-side menu shown)
      if (contentClientHeight !== 0) {
        this.chatContent.scrollToBottom(0)
          // we need only one emit
          .then(() => resizeContentObserver.disconnect());
      }
    });
    resizeContentObserver.observe((this.chatContent as any).el);
  }

}
