import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { JanusMainService } from '../janus/janus-main.service';
import { SharedIsFullWidthService } from '../../shared/services/shared-is-full-width.service';
import { map } from 'rxjs/operators';
import { MenuControllerService } from '../../../main/services/menu-controller.service';
import { RoomStartSideComponent } from '../components/room-start-side/room-start-side.component';
import { RoomEndSideComponent } from '../components/room-end-side/room-end-side.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
})
export class RoomPage implements OnInit {
  public readonly isMobile$ = this.appWidthService.isAppFullWidth$.pipe(
    map(value => !value)
  );
  public readonly remoteTracks$ = this.janusService.remoteTracks$;
  public readonly localTracks$ = this.janusService.localTracks$;

  public readonly roomId = 1234;
  public audioOutputId = 'default';

  constructor(
    private readonly janusService: JanusMainService,
    private readonly appWidthService: SharedIsFullWidthService,
    private readonly menuController: MenuControllerService,
  ) {}

  ngOnInit(): void {
    // const res = confirm('use initial tracks?');
    this.janusService.joinRoom(this.roomId, true, false);
  }

  public streamsTrackBy(index: number, item: any): string | number {
    // key for remote tracks and index for local ones
    return item.key ?? index;
  }

  public setAudioOutputId(event: string): void {
    this.audioOutputId = event;
  }

  ionViewWillEnter(): void {
    this.menuController.setStartSideMenuComponent(RoomStartSideComponent);
    this.menuController.setEndSideMenuTemplate({ component: RoomEndSideComponent });
  }

  ionViewWillLeave(): void {
    this.menuController.clearEndSideMenuTemplate();
  }

}
