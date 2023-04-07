import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { MenuControllerService } from '../../../../services/menu-controller.service';
import { ChannelEndSideComponent } from '../../components';
import { ChannelsDataService } from '../../services';
import { firstValueFrom, shareReplay, switchMap, tap, map } from 'rxjs';
import { InjectorService } from '../../../../../core';
import { InfiniteScrollEvent, ReusableComponent, SharedChatComponent } from '../../../../../shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-current-chat',
  templateUrl: './current-channel.component.html',
  styleUrls: ['./current-channel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentChannelComponent extends ReusableComponent implements OnInit {
  @ViewChild(SharedChatComponent) chatComponent: SharedChatComponent;

  public readonly channelId$ = this.activatedRoute.params.pipe(
    map(params => parseInt(params.id, 10)),
    tap(id => this.updateEndSideMenu(id)),
    shareReplay(1)
  );

  public readonly title$ = this.channelId$.pipe(
    switchMap(id => this.channelsData.getChannelTitle(id))
  );

  public readonly chatInfo$ = this.channelId$.pipe(
    switchMap(id => this.channelsData.getChannelChatInfo(id)),
    shareReplay(1)
  );

  public readonly messages$ = this.channelId$.pipe(
    switchMap(id => this.channelsData.getChannelMessages(id)),
    shareReplay(1)
  );

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly menuController: MenuControllerService,
    private readonly inj: InjectorService,
    private readonly channelsData: ChannelsDataService
  ) {
    console.log('CURRENT-CHANNEL-WAS-CREATED');
    super();
  }

  ngOnInit(): void {
    this.reused.pipe(
      untilDestroyed(this)
    ).subscribe(() => this.onReuseView());
  }

  public infiniteScroll(scrollEvent: InfiniteScrollEvent): void {
    firstValueFrom(this.channelId$)
      .then(id => this.channelsData.loadChannelMessages(id, scrollEvent.side))
      .then(() => scrollEvent.resolve());
  }

  public updateLastReadMessage(mesId: number): void {
    firstValueFrom(this.channelId$)
      .then(id => this.channelsData.updateLastReadMessage(id, mesId));
  }

  public messageSend(content: string): void {
    firstValueFrom(this.channelId$)
      .then(id => this.channelsData.sendMessageToChannel(id, content));
  }

  public async openInfoModal(modal: IonModal): Promise<void> {
    await modal.present();
  }

  private onReuseView(): void {
    console.log('CURRENT-CHANNEL-WAS-REUSED');
    this.chatComponent.recheckView();
    firstValueFrom(this.channelId$)
      .then(id => this.updateEndSideMenu(id));
  }

  private updateEndSideMenu(id: number): void {
    this.menuController.setEndSideMenuTemplate({
      component: ChannelEndSideComponent,
      injector: this.inj.createInjector<number>(id)
    });
  }
}
