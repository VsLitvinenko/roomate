import { Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { testMessages } from './data-source';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-current-chat',
  templateUrl: './current-channel.component.html',
  styleUrls: ['./current-channel.component.scss'],
})
export class CurrentChannelComponent implements OnInit {
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
    this.loadingData()
      .then(() => this.chatContent.scrollToBottom(0))
      .then(() => this.loadingCounter -= 1);
  }

  public infiniteScroll(event: any): void {
    this.loadingData()
      .then(() => event.target.complete());
  }

  private loadingData(): Promise<void> {
    return new Promise<void>(resolve =>
      setTimeout(() => {
        this.dataSource.push(...testMessages);
        resolve();
      }, 1000)
    );
  }
}
