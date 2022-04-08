import { Component, OnInit } from '@angular/core';
import { JanusService, RoomReady } from '../janus/janus.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SharedIsFullWidthService } from '../../shared/services/shared-is-full-width.service';
import { filter, map } from 'rxjs/operators';
import { MenuControllerService } from '../../../main/services/menu-controller.service';
import { RoomStartSideComponent } from '../components/room-start-side/room-start-side.component';
import { RoomEndSideComponent } from '../components/room-end-side/room-end-side.component';
import { JanusJS } from '../janus/janus.interfaces';

@UntilDestroy()
@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
})
export class RoomPage implements OnInit {
  public isMobile$ = this.appWidthService.isAppFullWidth$.pipe(
    map(value => !value)
  );

  public publishers: JanusJS.Publisher[] = [];
  public readonly roomId = 1234;
  public roomReady: RoomReady;

  public isAudioMuted = false;
  public isVideoMuted = false;

  constructor(
    private readonly janusService: JanusService,
    private readonly appWidthService: SharedIsFullWidthService,
    private readonly menuController: MenuControllerService,
  ) {}

  ngOnInit() {
    this.janusService.joinRoom(this.roomId);
    this.janusServiceSubscribes();
  }

  ionViewWillEnter(): void {
    this.menuController.setStartSideMenuComponent(RoomStartSideComponent);
    this.menuController.setEndSideMenuTemplate({ component: RoomEndSideComponent });
  }

  ionViewWillLeave(): void {
    this.menuController.clearEndSideMenuTemplate();
  }

  public toggleAudio(): void {
    this.isAudioMuted = !this.isAudioMuted;
    this.janusService.toggleAudio(this.isAudioMuted);
  }

  public toggleVideo(): void {
    this.isVideoMuted = !this.isVideoMuted;
    this.janusService.toggleVideo(this.isVideoMuted);
  }

  private janusServiceSubscribes(): void {
    this.janusService.roomReady$()
      .subscribe(rdy => {
        this.roomReady = rdy;
        this.toggleAudio();
      });

    this.janusService.newPublisher$
      .pipe(untilDestroyed(this))
      .subscribe(newPublisher => this.publishers.push(newPublisher));

    this.janusService.deletePublisher$
      .pipe(
        map(id => this.publishers.findIndex(publisher => publisher.id === id)),
        filter(index => index !== -1),
        untilDestroyed(this)
      ).subscribe(index => this.publishers.splice(index, 1));

    this.janusService.localStream$
      .pipe(untilDestroyed(this))
      .subscribe(localStream => {});
  }

}
