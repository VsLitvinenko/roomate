import { Component, OnInit } from '@angular/core';
import { JanusMainService } from '../janus/services/janus-main.service';
import { UntilDestroy } from '@ngneat/until-destroy';
import { SharedIsFullWidthService } from '../../shared/services/shared-is-full-width.service';
import { map } from 'rxjs/operators';
import { MenuControllerService } from '../../../main/services/menu-controller.service';
import { RoomStartSideComponent } from '../components/room-start-side/room-start-side.component';
import { RoomEndSideComponent } from '../components/room-end-side/room-end-side.component';
import { JanusJS } from '../janus/janus.types';

@UntilDestroy()
@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
})
export class RoomPage implements OnInit {
  public readonly isMobile$ = this.appWidthService.isAppFullWidth$.pipe(
    map(value => !value)
  );

  public readonly roomId = 1234;

  constructor(
    private readonly janusService: JanusMainService,
    private readonly appWidthService: SharedIsFullWidthService,
    private readonly menuController: MenuControllerService,
  ) {}

  public get remoteTracks(): JanusJS.PublisherTracks[] {
    return Object.values(this.janusService.remoteTracks);
  }

  public get localTracks(): JanusJS.PublisherTracks[] {
    return this.janusService.localTracks;
  }

  ngOnInit(): void {
    // const res = confirm('use initial tracks?');
    const res = true;
    this.janusService.joinRoom(this.roomId, res, res);
  }

  ionViewWillEnter(): void {
    this.menuController.setStartSideMenuComponent(RoomStartSideComponent);
    this.menuController.setEndSideMenuTemplate({ component: RoomEndSideComponent });
  }

  ionViewWillLeave(): void {
    this.menuController.clearEndSideMenuTemplate();
  }

}
