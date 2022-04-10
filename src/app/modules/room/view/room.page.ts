import { Component, OnInit } from '@angular/core';
import { JanusMainService } from '../janus/services/janus-main.service';
import { UntilDestroy } from '@ngneat/until-destroy';
import { SharedIsFullWidthService } from '../../shared/services/shared-is-full-width.service';
import { map } from 'rxjs/operators';
import { MenuControllerService } from '../../../main/services/menu-controller.service';
import { RoomStartSideComponent } from '../components/room-start-side/room-start-side.component';
import { RoomEndSideComponent } from '../components/room-end-side/room-end-side.component';
import { PublisherTracks } from '../janus/services/janus-subscribe.service';

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

  public readonly roomId = 1234;

  public roomConfigured = false;
  public isAudioMuted = false;
  public isVideoMuted = false;

  constructor(
    private readonly janusService: JanusMainService,
    private readonly appWidthService: SharedIsFullWidthService,
    private readonly menuController: MenuControllerService,
  ) {}

  public get remoteTracks(): PublisherTracks[] {
    return Object.values(this.janusService.remoteTracks)
      .filter(item => item.tracks?.length >= 2);
  }

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
    this.janusService.roomConfigured
      .subscribe(() => {
        this.roomConfigured = true;
        this.toggleAudio();
      });
  }

}
