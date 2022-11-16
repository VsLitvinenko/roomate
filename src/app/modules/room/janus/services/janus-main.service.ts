import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, mapTo, take } from 'rxjs/operators';
import { acodec, doDtx, Janus, vcodec } from '../janus.constants';
import { JanusJS } from '../janus.types';
import { JanusSubscribeService } from './janus-subscribe.service';
import { JanusShareScreenService } from './janus-share-screen.service';

const token = '1652177176,janus,janus.plugin.videoroom:f/oyakOF0lBzParWZNwKhz6CCig=';
const server = 'http://localhost:8088/janus';

@Injectable()
export class JanusMainService {
  private janusReady$ = new BehaviorSubject<boolean>(false);
  private roomConfigured$ = new BehaviorSubject<boolean>(false);

  private janus: JanusJS.Janus;
  private mainPlugin: JanusJS.PluginHandle;

  private roomId: number;
  private myScreenPublishId: number;

  private localPublisher: JanusJS.PublisherTracks = {
    display: 'You',
    audioTrack: null,
    videoTrack: null
  };
  private streams: any[];

  constructor(
    private readonly receiveService: JanusSubscribeService,
    private readonly screenService: JanusShareScreenService
  ) {
    Janus.init({
      debug: true,
      dependencies: Janus.useDefaultDependencies(null),
      callback: () => this.janusReady$.next(true)
    });
  }

  public get roomConfigured(): Observable<void> {
    return this.roomConfigured$.pipe(
      filter(ready => ready),
      mapTo(void 0),
      take(1)
    );
  }

  public get remoteTracks(): { [publisherId: number]: JanusJS.PublisherTracks } {
    return this.receiveService.remoteTracks;
  }

  public get localTracks(): JanusJS.PublisherTracks[] {
    return [
      this.localPublisher,
      this.screenService.localScreenPublisher
    ].filter(item => item);
  }

  public toggleAudio(muted: boolean): void {
    if (muted) {
      this.mainPlugin.muteAudio();
    } else  {
      this.mainPlugin.unmuteAudio();
    }
  }

  public toggleVideo(muted: boolean): void {
    const tracks = [];
    const request = { request: 'configure', video: true };
    if (muted) {
      const currentStream = this.streams.find(item => !item.disabled && item.type === 'video');
      tracks.push({ type: 'video', mid: currentStream.mid, remove: true });
    }
    else {
      tracks.push({ type: 'video', add: true, capture: true, recv: false });
    }
    this.createOffer(tracks, request);
  }

  public toggleScreen(share: boolean): void {
    if (share) {
      this.screenService.attachPlugin(this.janus.attach, this.roomId).pipe(
        take(1)
      ).subscribe(id => this.myScreenPublishId = id);
    }
    else {
      this.myScreenPublishId = undefined;
      this.screenService.destroyPlugin();
    }
  }


  public replaceVideo(deviceId: string): void {
    this.mainPlugin.createOffer({
      media: {
        video: { deviceId },
        replaceVideo: true
      },
      success: jsep => this.mainPlugin.send({
        message: {audio: true, video: true},
        jsep
      })
    });
  }

  public joinRoom(roomId: number): void {
    this.roomId = roomId;
    this.createSession();
  }

  private createSession(): void {
    this.janusReady$.pipe(
      filter(ready => ready),
      take(1)
    ).subscribe(() => this.janus = new Janus({
        success: () => this.mainPluginAttaching(),
        error: error => Janus.error('Roomate session creating error', error),
        server,
        token
      }));
  }

  private mainPluginAttaching(): void {
    this.janus.attach({
      plugin: 'janus.plugin.videoroom',
      success: pluginHandle => this.mainPluginHandling(pluginHandle),
      error: error => Janus.error('pluginAttaching error:', error),
      onmessage: (message, jsep) => this.onMainMessage(message, jsep),
      onlocaltrack: (track, on) => this.onLocalTrack(track, on),
    });
  }

  private mainPluginHandling(plugin: JanusJS.PluginHandle): void {
    this.mainPlugin = plugin;
    const request = {
      request: 'join',
      room: this.roomId,
      ptype: 'publisher',
      display: `tohaloh${Math.random() * 100}`
    };
    this.mainPlugin.send({ message: request });
  }

  private onMainMessage(msg: JanusJS.Message, jsep: JanusJS.JSEP): void {
    if ((msg as any).videoroom === 'joined') {
      this.onJoinedRoom(msg);
    }
    if (msg.publishers) {
      msg.publishers
        .filter(publisher => this.myScreenPublishId === undefined || publisher.id !== this.myScreenPublishId)
        .forEach(publisher => this.receiveService.onUpdatePublisher(publisher));
    }
    if ((msg as any).leaving) {
      this.receiveService.onDeletePublisher((msg as any).leaving);
    }
    if (msg.streams) {
      this.streams = msg.streams;
    }
    if (jsep) {
      this.mainPlugin.handleRemoteJsep({ jsep });
    }
  }

  private onJoinedRoom(msg: JanusJS.Message): void {
    const request = {
      request: 'configure',
      audio: true,
      video: true,
      audiocodec: acodec || undefined,
      videocodec: vcodec || undefined
    };
    const tracks = [
      { type: 'audio', capture: true, recv: false },
      { type: 'video', capture: true, recv: false }
    ];
    const handler = () => this.receiveService.attachPlugin(
      this.janus.attach,
      (msg as any).private,
      this.roomId
    );
    this.createOffer(tracks, request, handler, true);
  }

  private createOffer(
    tracks: any[],
    configureRequest: any,
    successHandler = () => undefined,
    initial = false
  ): void {
    this.mainPlugin.createOffer({
      tracks,
      success: jsep => {
        this.configure(jsep, configureRequest, initial);
        successHandler();
      },
      error: error => Janus.error('WebRTC error:', error),
      customizeSdp: jsep => {
        if (doDtx) {
          jsep.sdp = jsep.sdp.replace('useinbandfec=1', 'useinbandfec=1;usedtx=1');
        }
      }
    });
  }

  private configure(jsep, message, initial: boolean): void {
    this.mainPlugin.send({
      message,
      jsep,
      success: () => {
        if (initial) {
          this.roomConfigured$.next(true);
        }
      }
    });
  }

  private onLocalTrack(track: MediaStreamTrack, on: boolean): void {
    switch (track.kind) {
      case 'audio':
        this.localPublisher.audioTrack = on ? track : null;
        break;
      case 'video':
        this.localPublisher.videoTrack = on ? track : null;
        break;
    }
  }
}
