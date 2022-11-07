import { Component, Input, OnInit } from '@angular/core';
import { SharedIsFullWidthService } from '../../../shared/services/shared-is-full-width.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-media-footer',
  templateUrl: './media-footer.component.html',
  styleUrls: ['./media-footer.component.scss'],
})
export class MediaFooterComponent implements OnInit {
  @Input() public roomConfigured: boolean;

  public readonly isMobile$ = this.appWidthService.isAppFullWidth$.pipe(
    map(value => !value)
  );

  public isAudioMuted = false;
  public isVideoMuted = false;

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
  ) { }

  ngOnInit(): void {
    this.setMediaDevices();
  }

  public toggleAudio(): void {
    this.isAudioMuted = !this.isAudioMuted;
    // this.janusService.toggleAudio(this.isAudioMuted);
  }

  public toggleVideo(): void {
    this.isVideoMuted = !this.isVideoMuted;
    // this.janusService.toggleVideo(this.isVideoMuted);
  }

  public videoDeviceChanged(event): void {
    // this.janusService.replaceVideo(event);
  }

  private setMediaDevices(): void {
    navigator.mediaDevices.getUserMedia( {
      video: true,
      audio: true
    }).then(() => navigator.mediaDevices.enumerateDevices())
      .then(devices => {
        devices
          .filter(device => device.deviceId !== 'communications')
          .forEach(device => this.devices[device.kind].push(device));

        Object.keys(this.activeDevicesId)
          .forEach(key => this.activeDevicesId[key] = this.devices[key][0].deviceId);
      });
  }

}
