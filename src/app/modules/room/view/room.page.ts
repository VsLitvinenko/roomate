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

  public readonly audioInputDevices: MediaDeviceInfo[] = [];
  public readonly audioOutputDevices: MediaDeviceInfo[] = [];
  public readonly videoInputDevices: MediaDeviceInfo[] = [];

  public activeAudioInputId: string;
  public activeAudioOutputId: string;
  public activeVideoInputId: string;

  constructor(
    private readonly janusService: JanusMainService,
    private readonly appWidthService: SharedIsFullWidthService,
    private readonly menuController: MenuControllerService,
  ) {}

  public get remoteTracks(): PublisherTracks[] {
    return Object.values(this.janusService.remoteTracks)
      .filter(item => item.tracks?.length >= 2);
  }

  ngOnInit(): void {
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

  public videoDeviceChanged(event): void {
    this.janusService.replaceVideo(event);
  }

  private janusServiceSubscribes(): void {
    this.janusService.roomConfigured
      .subscribe(() => {
        this.roomConfigured = true;
        this.setMediaDevices();
        this.toggleAudio();
      });
  }

  private setMediaDevices(): void {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      devices.filter(device => device.deviceId !== 'communications')
        .forEach(device => {
          switch (device.kind) {
            case 'audioinput':
              this.audioInputDevices.push(device);
              break;
            case 'audiooutput':
              this.audioOutputDevices.push(device);
              break;
            case 'videoinput':
              this.videoInputDevices.push(device);
              break;
          }
        });
      this.activeAudioInputId = this.audioInputDevices[0].deviceId;
      this.activeAudioOutputId = this.audioOutputDevices[0].deviceId;
      this.activeVideoInputId = this.videoInputDevices[0].deviceId;
    });
  }

}
