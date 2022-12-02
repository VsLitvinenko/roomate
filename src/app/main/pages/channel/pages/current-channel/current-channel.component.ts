import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonModal } from '@ionic/angular';
import { MenuControllerService } from '../../../../services/menu-controller.service';
import { ChannelEndSideComponent } from '../../components/menus/channel-end-side/channel-end-side.component';
import { delay, filter, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { ChannelsDataService } from '../../services/channels-data.service';
import { combineLatest, from, Observable } from 'rxjs';
import { Message, InjectorService } from '../../../../../core';
import { isTouchDevice, promiseDelay } from '../../../../../shared';
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

  public readonly isTouchDevise = isTouchDevice;
  public readonly messages$ = this.getChannelMessagesFromStore();
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
    this.messages$.pipe(
      take(1),
    ).subscribe(() =>
      this.chatContent.scrollToBottom(0)
        .then(() => this.loading = false)
    );
    // other messages updates
    this.scrollToBottomOnNewMessageSubscribe();
  }

  ionViewWillEnter(): void {
    if (!this.loading) {
      this.loading = true;
      // for smooth animation
      promiseDelay(100).then(() => this.loading = false);
    }
  }

  public infiniteScroll(event: any): void {
    this.channelsData.loadChannelMessages(this.channelId).then(
      () => event.target.complete()
    );
  }

  public async messageSend(content: string): Promise<void> {
    await this.channelsData.sendMessageToChannel(this.channelId, {
      id: Date.now(),
      senderId: null,
      timestamp: (new Date()).toISOString(),
      attachments: [],
      isRead: true,
      content
    });
  }

  public async openInfoModal(modal: IonModal): Promise<void> {
    await modal.present();
  }

  private getChannelMessagesFromStore(): Observable<Message[]> {
    return this.activatedRoute.params.pipe(
      tap(params => {
        this.channelId = parseInt(params.id, 10);
        this.title$ = this.channelsData.getChannelTitle(this.channelId);
        this.updateEndSideMenu(this.channelId);
      }),
      switchMap(params => this.channelsData.getChannelMessages(parseInt(params.id, 10))),
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
      this.messages$
    ]).pipe(
      filter(([el, messages]) => {
        const oneNewMessage = messages.length - prevMessagesLength === 1;
        prevMessagesLength = messages.length;
        return oneNewMessage && (
          messages[0].senderId === 1 ||
          el.scrollHeight - (el.scrollTop + el.clientHeight) < 10
        );
      }),
      delay(10), // rerender time
      untilDestroyed(this)
    ).subscribe(() => this.chatContent.scrollToBottom(200));
  }
}
