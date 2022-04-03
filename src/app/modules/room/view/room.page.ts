import { Component, OnInit } from '@angular/core';
import { JanusService } from '../janus/janus.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
})
export class RoomPage implements OnInit {

  constructor(private readonly janusService: JanusService) {}

  ngOnInit() {
    // this.janusService.joinRoom(1234);

    this.janusService.newRemoteStream$
      .pipe(untilDestroyed(this))
      .subscribe(remoteStream => {});

    this.janusService.localStream$
      .pipe(untilDestroyed(this))
      .subscribe(localStream => {});
  }

}
