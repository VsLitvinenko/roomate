import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { JanusMainService } from '../janus';
import { map } from 'rxjs/operators';
import { ReactiveViewControllerService } from '../../../services/reactive-view-controller.service';
import { RoomStartSideComponent, RoomEndSideComponent } from '../components';
import { isAppFullWidth$ } from '../../../../shared';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
})
export class RoomPage implements OnInit {
  public readonly isMobile$ = isAppFullWidth$.pipe(
    map(value => !value)
  );
  public readonly remoteTracks$ = this.janusService.remoteTracks$;
  public readonly localTracks$ = this.janusService.localTracks$;

  public readonly roomId = 1234;
  public audioOutputId = 'default';

  constructor(
    private readonly janusService: JanusMainService,
    private readonly viewController: ReactiveViewControllerService,
  ) {}

  ngOnInit(): void {
    this.viewController.setStartSideMenuComponent(RoomStartSideComponent);
    this.viewController.setEndSideMenuTemplate({ component: RoomEndSideComponent });
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

}
