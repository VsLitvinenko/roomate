import {ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { ReactiveViewControllerService } from '../../../../services/reactive-view-controller.service';
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
  @ViewChild(SharedChatComponent) private readonly chatComponent: SharedChatComponent;
  @ViewChild('header', { static: true }) private readonly headerTemplate: TemplateRef<any>;

  public readonly channelId$ = this.activatedRoute.params.pipe(
    map(params => parseInt(params.id, 10)),
    tap(id => this.updateReactiveView(id)),
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

  private bufferStoredScrollPoint: number;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly viewController: ReactiveViewControllerService,
    private readonly inj: InjectorService,
    private readonly channelsData: ChannelsDataService
  ) {
    console.log('CURRENT-CHANNEL-WAS-CREATED');
    super();
  }

  ngOnInit(): void {
    this.reused.pipe(untilDestroyed(this)).subscribe(() => this.onReuseView());
    this.stored.pipe(untilDestroyed(this)).subscribe(() => this.onStoreView());
  }

  public infiniteScroll(scrollEvent: InfiniteScrollEvent): void {
    firstValueFrom(this.channelId$)
      .then(id => this.channelsData.loadChannelMessages(id, scrollEvent.side))
      .then(() => scrollEvent.resolve());
  }

  public updateLastReadMessage(mesId: number): void {
    console.log('UPDATE LAST READ MESSAGE');
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

  private onStoreView(): void {
    // console.log('CURRENT-CHANNEL-WAS-STORED');
    this.chatComponent.ignoreNgOnChanges = true;
    this.bufferStoredScrollPoint = this.chatComponent.getCurrentScrollPoint();
  }

  private onReuseView(): void {
    // console.log('CURRENT-CHANNEL-WAS-REUSED');
    this.chatComponent.ignoreNgOnChanges = false;
    firstValueFrom(this.channelId$)
      .then(id => this.updateReactiveView(id))
      .then(() => this.chatComponent.recheckView(this.bufferStoredScrollPoint));
  }

  private updateReactiveView(id: number): void {
    this.viewController.setHeaderTemplate({
      template: this.headerTemplate,
      endSideButtonIcon: 'globe-sharp'
    });

    this.viewController.setEndSideMenuTemplate({
      component: ChannelEndSideComponent,
      injector: this.inj.createInjector<number>(id)
    });
  }
}
