import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MenuControllerService } from '../../../../main/services/menu-controller.service';
import { ChannelEndSideComponent } from '../../components/channel-end-side/channel-end-side.component';
import { SharedInjectorService } from '../../../shared/services/shared-injector.service';
import { testGroupMessages } from '../../../../api/data-source';

@UntilDestroy()
@Component({
  selector: 'app-current-chat',
  templateUrl: './current-channel.component.html',
  styleUrls: ['./current-channel.component.scss'],
})
export class CurrentChannelComponent implements OnInit {
  @ViewChild('currentChatContent')
  private readonly chatContent: IonContent;

  public channelId: string;
  public messages = [];

  private loadingCounter = 0;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly menuController: MenuControllerService,
    private readonly inj: SharedInjectorService,
  ) { }

  get loading(): boolean {
    return this.loadingCounter !== 0;
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      untilDestroyed(this)
    ).subscribe(params => {
      this.channelId = params.id;
      this.updateEndSideMenu(this.channelId);

      this.messages = [];
      this.loadingCounter += 1;
      this.loadingData()
        .then(() => this.chatContent.scrollToBottom(0))
        .then(() => this.loadingCounter -= 1);
    });
  }

  public infiniteScroll(event: any): void {
    this.loadingData()
      .then(() => event.target.complete());
  }

  public messageSend(event: string): void {
    alert(event);
  }

  private loadingData(): Promise<void> {
    return new Promise<void>(resolve =>
      setTimeout(() => {
        this.messages.push(...testGroupMessages);
        resolve();
      }, 1000)
    );
  }

  private updateEndSideMenu(id: string): void {
    this.menuController.setEndSideMenuTemplate({
      component: ChannelEndSideComponent,
      injector: this.inj.createInjector<string>(id)
    });
  }
}
