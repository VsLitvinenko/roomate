import { Component, OnInit } from '@angular/core';
import { SharedIsFullWidthService } from '../../../shared/services/shared-is-full-width.service';
import { map, take } from 'rxjs/operators';
import { JanusMainService } from '../../janus/services/janus-main.service';

@Component({
  selector: 'app-media-footer',
  templateUrl: './media-footer.component.html',
  styleUrls: ['./media-footer.component.scss'],
})
export class MediaFooterComponent implements OnInit {
  public readonly isMobile$ = this.appWidthService.isAppFullWidth$.pipe(
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
    private readonly appWidthService: SharedIsFullWidthService,
    private readonly janusService: JanusMainService,
  ) { }

  ngOnInit(): void {
    this.janusService.roomConfigured.pipe(
      take(1)
    ).subscribe(() => {
      this.setMediaDevices();
      this.roomConfigured = true;
      this.isAudioMuted = !this.janusService.initialUseAudio;
      this.isVideoMuted = !this.janusService.initialUseVideo;
    });
  }

  public toggleAudio(): void {
    this.isAudioMuted = !this.isAudioMuted;
    this.janusService.toggleAudio(this.isAudioMuted);
  }

  public toggleVideo(): void {
    this.isVideoMuted = !this.isVideoMuted;
    this.janusService.toggleVideo(this.isVideoMuted);
  }

  public videoDeviceChanged(event): void {
    // this.janusService.replaceVideo(event);
  }

  public toggleScreen(): void {
    this.isScreenSharing = !this.isScreenSharing;
    this.janusService.toggleScreen(this.isScreenSharing);
  }

  private setMediaDevices(): void {
    // get user media request should be already done
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        devices
          .filter(device => device.deviceId !== 'communications')
          .forEach(device => this.devices[device.kind].push(device));

        Object.keys(this.activeDevicesId)
          .forEach(key => this.activeDevicesId[key] = this.devices[key][0].deviceId);
      });
  }

}
