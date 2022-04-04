import { Component, OnInit } from '@angular/core';
import { JanusService, NewPublisher } from '../janus/janus.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SharedIsFullWidthService } from '../../shared/services/shared-is-full-width.service';
import { map } from 'rxjs/operators';
import { MenuControllerService } from '../../../main/services/menu-controller.service';
import { RoomStartSideComponent } from '../components/room-start-side/room-start-side.component';

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

  public publishers: NewPublisher[] = [];
  public readonly roomId = 1234;

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
  }

  ionViewWillLeave(): void {
    this.menuController.clearEndSideMenuTemplate();
  }

  private janusServiceSubscribes(): void {
    this.janusService.newPublisher$
      .pipe(untilDestroyed(this))
      .subscribe(newPublisher => this.publishers.push(newPublisher));

    this.janusService.deletePublisher$
      .pipe(untilDestroyed(this))
      .subscribe(id => this.publishers
        .splice(this.publishers
          .findIndex(item => item.publisher.id === id), 1));

    this.janusService.localStream$
      .pipe(untilDestroyed(this))
      .subscribe(localStream => {});
  }

}
