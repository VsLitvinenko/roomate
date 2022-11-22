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

  public messages$ = this.getChannelMessagesFromStore();
  public channelId: number;
  public loading = false;

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
    ).subscribe(() => {
      this.updateEndSideMenu(this.channelId);
      this.chatContent.scrollToBottom(0).then(
        () => this.loading = false
      );
    });
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
      tap(params => this.channelId = params.id),
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
