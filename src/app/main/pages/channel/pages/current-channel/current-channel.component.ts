import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonModal } from '@ionic/angular';
import { MenuControllerService } from '../../../../services/menu-controller.service';
import { ChannelEndSideComponent } from '../../components';
import { delay, filter, shareReplay, switchMap, take, tap, map } from 'rxjs/operators';
import { ChannelsDataService } from '../../services';
import { BehaviorSubject, combineLatest, firstValueFrom, from } from 'rxjs';
import { InjectorService } from '../../../../../core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-current-chat',
  templateUrl: './current-channel.component.html',
  styleUrls: ['./current-channel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentChannelComponent implements OnInit {
  @ViewChild('currentChatContent', { static: true }) private readonly chatContent: IonContent;

  public readonly channelId$ = this.activatedRoute.params.pipe(
    map(params => parseInt(params.id, 10)),
    tap(id => this.updateEndSideMenu(id)),
    shareReplay(1)
  );

  public readonly title$ = this.channelId$.pipe(
    switchMap(id => this.channelsData.getChannelTitle(id))
  );

  public readonly messagesInfo$ = this.channelId$.pipe(
    switchMap(id => this.channelsData.getChannelMessagesInfo(id)),
    shareReplay(1)
  );
  public readonly loading$ = new BehaviorSubject<boolean>(true);

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly menuController: MenuControllerService,
    private readonly inj: InjectorService,
    private readonly channelsData: ChannelsDataService
  ) { }

  ngOnInit(): void {
    // init messages update
    this.messagesInfo$.pipe(
      take(1),
      delay(10) // render time
    ).subscribe(() =>
      this.chatContent.scrollToBottom(0)
        .then(() => this.loading$.next(false))
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
    firstValueFrom(this.channelId$)
      .then(id => this.channelsData.loadTopChannelMessages(id))
      .then(() => event.target.complete());
  }

  public messageSend(content: string): void {
    firstValueFrom(this.channelId$)
      .then(id => this.channelsData.sendMessageToChannel(id, content));
  }

  public async openInfoModal(modal: IonModal): Promise<void> {
    await modal.present();
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
