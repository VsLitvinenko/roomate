import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { JanusJS } from '../types/janus.interfaces';
import {acodec, doDtx, doOpusred, doSimulcast, doSvc, vcodec, vprofile} from './janus.constants';
import adapter from 'webrtc-adapter';

(window as any).adapter = adapter;
// eslint-disable-next-line @typescript-eslint/naming-convention
const Janus = (window as any).Janus;

@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
})
export class RoomPage implements OnInit {
  @ViewChild('video') videoEl: ElementRef<HTMLVideoElement>;

  private janus: JanusJS.Janus;
  private echotest: JanusJS.PluginHandle;

  private readonly localTracks = {};
  private readonly remoteTracks = {};

  constructor() {}

  ngOnInit() {
    Janus.init({
      debug: true,
      dependencies: Janus.useDefaultDependencies(null),
      callback: () => this.createSession()
    });
  }

  private createSession(): void {
    this.janus = new Janus({
        server: 'https://80-78-247-250.cloudvps.regruhosting.ru/janusbase/janus/',
        success: () => this.pluginAttaching(),
        error: () => console.log('connection error?'),
        destroyed: () => {}
      });
  }

  private pluginAttaching(): void {
    console.log('attaching plugins...');
    this.janus.attach({
      plugin: 'janus.plugin.echotest',
      success: pluginHandle => this.pluginHandling(pluginHandle),
      error: error => Janus.error('pluginAttaching error:', error),
      onmessage: (message, jsep) => this.onMessage(message, jsep),
      onlocaltrack: (track, on) => this.onLocalTrack(track, on),
      onremotetrack: (track, mid, on) => this.onRemoteTrack(track, mid, on),
    });
  }

  private pluginHandling(echotest: JanusJS.PluginHandle): void {
    this.echotest = echotest;
    const body = {
      request: undefined,
      audio: true,
      video: true,
      audiocodec: acodec || undefined,
      videocodec: vcodec || undefined,
      videoprofile: vprofile || undefined,
      opusred: doOpusred || undefined,
    };
    this.echotest.send({ message: body });
    this.echotest.createOffer({
      media: { data: true },
      simulcast: doSimulcast,
      svc: (vcodec === 'av1' && doSvc) ? doSvc : null,
      customizeSdp: jsep => {
        if (doDtx) {
          // If DTX is enabled, munge the SDP
          jsep.sdp = jsep.sdp.replace('useinbandfec=1', 'useinbandfec=1;usedtx=1');
        }
      },
      success: jsep => this.echotest.send({ message: body, jsep }),
      error: error => Janus.error('WebRTC error:', error)
    });
  }

  // _____________________________________________

  private onMessage(msg: JanusJS.Message, jsep: JanusJS.JSEP): void {
    Janus.debug(' ::: Got a message :::', msg);
    if (jsep) {
      this.echotest.handleRemoteJsep({ jsep });
    }
  }

  private onLocalTrack(track: MediaStreamTrack, on: boolean): void {
    // this.localTracks[track.id] = track.clone();
    //
    // if (Object.keys(this.localTracks).length === 2) {
    //   const myStream = new MediaStream();
    //   Object.keys(this.localTracks)
    //     .forEach(key => myStream.addTrack(this.localTracks[key]));
    //   Janus.attachMediaStream(this.videoEl.nativeElement, myStream);
    // }
  }

  private onRemoteTrack(track: MediaStreamTrack, mid: any, on: boolean): void {
    if (track.muted) {
      return;
    }
    this.remoteTracks[track.id] = track.clone();

    if (Object.keys(this.remoteTracks).length === 2) {
      const myStream = new MediaStream();
      Object.keys(this.remoteTracks)
        .forEach(key => myStream.addTrack(this.remoteTracks[key]));
      Janus.attachMediaStream(this.videoEl.nativeElement, myStream);
    }
  }
}
