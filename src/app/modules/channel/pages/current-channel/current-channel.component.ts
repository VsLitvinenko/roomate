import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { MenuControllerService } from '../../../../main/services/menu-controller.service';
import { ChannelEndSideComponent } from '../../components/channel-end-side/channel-end-side.component';
import { SharedInjectorService } from '../../../shared/services/shared-injector.service';
import { switchMap, take, tap } from 'rxjs/operators';
import { ChannelsSelectService } from '../../services/channels-select.service';
import { Observable } from 'rxjs';
import { Message } from '../../../../api/channels-api';

@Component({
  selector: 'app-current-chat',
  templateUrl: './current-channel.component.html',
  styleUrls: ['./current-channel.component.scss'],
})
export class CurrentChannelComponent implements OnInit {
  @ViewChild('currentChatContent') private readonly chatContent: IonContent;

  public readonly messages$ = this.getChannelMessagesFromStore();
  public title$: Observable<string>;
  public loading = false;

  private channelId: number;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly menuController: MenuControllerService,
    private readonly inj: SharedInjectorService,
    private readonly channelsSelect: ChannelsSelectService
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
    this.channelsSelect.loadChannelMessages(this.channelId).then(
      () => event.target.complete()
    );
  }

  public messageSend(event: string): void {
    alert(event);
  }

  private getChannelMessagesFromStore(): Observable<Message[]> {
    return this.activatedRoute.params.pipe(
      tap(params => {
        this.channelId = parseInt(params.id, 10);
        this.title$ = this.channelsSelect.getChannelTitle(this.channelId);
        this.updateEndSideMenu(this.channelId);
      }),
      switchMap(params => this.channelsSelect.getChannelMessages(parseInt(params.id, 10))),
    );
  }

  private updateEndSideMenu(id: number): void {
    this.menuController.setEndSideMenuTemplate({
      component: ChannelEndSideComponent,
      injector: this.inj.createInjector<number>(id)
    });
  }
}
