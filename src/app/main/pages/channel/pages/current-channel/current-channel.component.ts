import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonModal } from '@ionic/angular';
import { MenuControllerService } from '../../../../services/menu-controller.service';
import { ChannelEndSideComponent } from '../../components';
import { delay, filter, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { ChannelMessagesInfo, ChannelsDataService } from '../../services';
import { combineLatest, from, Observable } from 'rxjs';
import { InjectorService } from '../../../../../core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-current-chat',
  templateUrl: './current-channel.component.html',
  styleUrls: ['./current-channel.component.scss'],
})
export class CurrentChannelComponent implements OnInit {
  @ViewChild('currentChatContent', { static: true })
  private readonly chatContent: IonContent;

  public readonly messagesInfo$ = this.getChannelMessagesFromStore();
  public title$: Observable<string>;
  public loading: boolean;

  public channelId: number;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly menuController: MenuControllerService,
    private readonly inj: InjectorService,
    private readonly channelsData: ChannelsDataService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    // init messages update
    this.messagesInfo$.pipe(
      take(1),
      delay(10) // render time
    ).subscribe(() =>
      this.chatContent.scrollToBottom(0)
        .then(() => this.loading = false)
    );
    // other messages updates
    this.scrollToBottomOnNewMessageSubscribe();
  }

  // ionViewWillEnter(): void {
  //   if (!this.loading) {
  //     this.loading = true;
  //     // for smooth animation
  //     promiseDelay(100).then(() => this.loading = false);
  //   }
  // }

  public infiniteScroll(event: any): void {
    this.channelsData.loadTopChannelMessages(this.channelId).then(
      () => event.target.complete()
    );
  }

  public async messageSend(content: string): Promise<void> {
    await this.channelsData.sendMessageToChannel(this.channelId, content);
  }

  public async openInfoModal(modal: IonModal): Promise<void> {
    await modal.present();
  }

  private getChannelMessagesFromStore(): Observable<ChannelMessagesInfo> {
    return this.activatedRoute.params.pipe(
      tap(params => {
        this.channelId = parseInt(params.id, 10);
        this.title$ = this.channelsData.getChannelTitle(this.channelId);
        this.updateEndSideMenu(this.channelId);
      }),
      switchMap(params => this.channelsData.getChannelMessagesInfo(parseInt(params.id, 10))),
      shareReplay(1)
    );
  }

  private updateEndSideMenu(id: number): void {
    this.menuController.setEndSideMenuTemplate({
      component: ChannelEndSideComponent,
      injector: this.inj.createInjector<number>(id)
    });
  }

  private scrollToBottomOnNewMessageSubscribe(): void {
    let prevMessagesLength = 0;
    combineLatest([
      from(this.chatContent.getScrollElement()),
      this.messagesInfo$
    ]).pipe(
      filter(([el, info]) => {
        const oneNewMessage = info.messages.length - prevMessagesLength === 1;
        prevMessagesLength = info.messages.length;
        return oneNewMessage && (
          info.messages[0].senderId === this.channelsData.selfUserId ||
          el.scrollHeight - (el.scrollTop + el.clientHeight) < 10
        );
      }),
      delay(10), // rerender time
      untilDestroyed(this)
    ).subscribe(() => this.chatContent.scrollToBottom(200));
  }
}
