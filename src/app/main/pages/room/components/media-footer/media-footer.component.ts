import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Location } from '@angular/common';
import { map, take } from 'rxjs/operators';
import { JanusMainService } from '../../janus';
import { isAppFullWidth$, isTouchDevice } from '../../../../../shared';

@Component({
  selector: 'app-media-footer',
  templateUrl: './media-footer.component.html',
  styleUrls: ['./media-footer.component.scss'],
})
export class MediaFooterComponent implements OnInit {
  @Output() public audioOutputId = new EventEmitter<string>();

  public readonly isTouchDevise = isTouchDevice;
  public readonly isMobile$ = isAppFullWidth$.pipe(
    map(value => !value)
  );

  public roomConfigured = false;
  public isAudioMuted = false;
  public isVideoMuted = false;
  public isScreenSharing = false;

  public readonly devices: { [id: string]: MediaDeviceInfo[] } = {
    audioinput: [],
    audiooutput: [],
    videoinput: []
  };

  public readonly activeDevicesId = {
    audioinput: '',
    audiooutput: '',
    videoinput: ''
  };

  constructor(
    private readonly janusService: JanusMainService,
    private readonly cdr: ChangeDetectorRef,
    private readonly location: Location
  ) { }

  ngOnInit(): void {
    this.janusService.roomConfigured.pipe(
      take(1)
    ).subscribe(() => {
        this.setMediaDevices().then(() => {
          this.roomConfigured = true;
          this.isAudioMuted = !this.janusService.initialUseAudio;
          this.isVideoMuted = !this.janusService.initialUseVideo;
          this.cdr.detectChanges();
        });
      }
    );
  }

  public deviceChanged(event: string, type: 'video' | 'audio'): void {
    this.janusService.replaceDevice(event, type);
  }

  public toggleAudio(): void {
    this.isAudioMuted = !this.isAudioMuted;
    this.janusService.toggleAudio(this.isAudioMuted);
  }

  public toggleVideo(): void {
    this.isVideoMuted = !this.isVideoMuted;
    this.janusService.toggleVideo(this.isVideoMuted);
  }

  public toggleScreen(): void {
    if (this.isScreenSharing) {
      // closeScreenSharing will complete previous shareScreen promise
      this.janusService.closeScreenSharing();
    }
    else {
      this.isScreenSharing = true;
      this.janusService.shareScreen()
        .then(() => this.isScreenSharing = false);
    }
  }

  public leaveRoom(): void {
    this.janusService.leaveRoom()
      .then(() => this.location.back());
  }

  private async setMediaDevices(): Promise<void> {
    // get user media request should be already done
    (await navigator.mediaDevices.enumerateDevices())
      .filter(device => device.deviceId !== 'communications')
      .forEach(device => this.devices[device.kind].push(device));

    Object.keys(this.activeDevicesId)
      .forEach(key => this.activeDevicesId[key] = this.devices[key][0]?.deviceId);
  }

}
