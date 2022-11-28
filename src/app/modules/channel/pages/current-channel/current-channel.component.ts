import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonModal } from '@ionic/angular';
import { MenuControllerService } from '../../../../main/services/menu-controller.service';
import { ChannelEndSideComponent } from '../../components/menus/channel-end-side/channel-end-side.component';
import { InjectorService } from '../../../shared/services/injector.service';
import { shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { ChannelsDataService } from '../../services/channels-data.service';
import { Observable } from 'rxjs';
import { Message } from '../../../../api/channels-api';
import { isTouchDevice } from '../../../shared/constants';

@Component({
  selector: 'app-current-chat',
  templateUrl: './current-channel.component.html',
  styleUrls: ['./current-channel.component.scss'],
})
export class CurrentChannelComponent implements OnInit {
  @ViewChild('currentChatContent') private readonly chatContent: IonContent;

  public readonly isTouchDevise = isTouchDevice;
  public readonly messages$ = this.getChannelMessagesFromStore();
  public title$: Observable<string>;
  public loading = false;

  public channelId: number;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly menuController: MenuControllerService,
    private readonly inj: InjectorService,
    private readonly channelsData: ChannelsDataService
  ) { }

  ngOnInit(): void {
  }

  ionViewWillEnter(): void {
    this.loading = true;
    this.messages$.pipe(
      take(1),
    ).subscribe(
      () => this.chatContent.scrollToBottom(0)
        .then(() => this.loading = false)
    );
  }

  public infiniteScroll(event: any): void {
    this.channelsData.loadChannelMessages(this.channelId).then(
      () => event.target.complete()
    );
  }

  public messageSend(event: string): void {
    alert(event);
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
}
