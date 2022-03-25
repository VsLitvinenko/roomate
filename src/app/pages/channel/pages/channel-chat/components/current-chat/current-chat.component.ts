import { Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { testMessages } from './data-source';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-current-chat',
  templateUrl: './current-chat.component.html',
  styleUrls: ['./current-chat.component.scss'],
})
export class CurrentChatComponent implements OnInit {
  @ViewChild('currentChatContent')
  private readonly chatContent: IonContent;

  public channelId: string;
  public dataSource = [];

  private loadingCounter = 0;

  constructor(private readonly activatedRoute: ActivatedRoute) { }

  get loading(): boolean {
    return this.loadingCounter !== 0;
  }

  ngOnInit(): void {
    this.activatedRoute.params
      .subscribe(params => this.channelId = params.id);

    this.loadingCounter += 1;
    setTimeout(() => {
      this.dataSource.push(...testMessages);
      this.chatContent.scrollToBottom(0)
        .then(() => this.loadingCounter -= 1);
    }, 1000);
  }
}
