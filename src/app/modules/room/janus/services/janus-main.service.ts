import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, mapTo, take } from 'rxjs/operators';
import { doDtx, Janus } from '../janus.constants';
import { JanusJS } from '../janus.types';
import { JanusSubscribeService } from './janus-subscribe.service';
import { JanusShareScreenService } from './janus-share-screen.service';

const token = '1652177176,janus,janus.plugin.videoroom:f/oyakOF0lBzParWZNwKhz6CCig=';
const server = 'http://localhost:8088/janus';

@Injectable()
export class JanusMainService {
  public initialUseAudio: boolean;
  public initialUseVideo: boolean;

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
    const tracks = [];
    const request = { request: 'configure', audio: true };
    if (muted) {
      const currentStream = this.streams.find(item => !item.disabled && item.type === 'audio');
      tracks.push({ type: 'audio', mid: currentStream.mid, remove: true });
    }
    else {
      tracks.push({ type: 'audio', add: true, capture: true });
    }
    this.createOffer(tracks, request);
  }

  public toggleVideo(muted: boolean): void {
    const tracks = [];
    const request = { request: 'configure', video: true };
    if (muted) {
      const currentStream = this.streams.find(item => !item.disabled && item.type === 'video');
      tracks.push({ type: 'video', mid: currentStream.mid, remove: true });
    }
    else {
      tracks.push({ type: 'video', add: true, capture: true });
    }
    this.createOffer(tracks, request);
  }

  // promise will be completed when screen plugin destroyed
  public async shareScreen(): Promise<void> {
    const event = await this.screenService.attachPlugin(this.janus.attach, this.roomId);
    this.myScreenPublishId = event.id;
    return event.sharingCanceled
      .then(() => this.myScreenPublishId = undefined);
  }

  public closeScreenSharing(): void {
    this.screenService.destroyPlugin();
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

  public joinRoom(roomId: number, useAudio: boolean, useVideo: boolean): void {
    this.roomId = roomId;
    this.initialUseAudio = useAudio;
    this.initialUseVideo = useVideo;
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
    this.receiveService.attachPlugin(
      this.janus.attach,
      (msg as any).private,
      this.roomId
    );
    this.roomConfigured$.next(true);

    if (!(this.initialUseVideo || this.initialUseAudio)) {
      return;
    }
    const request = {
      request: 'configure',
      audio: this.initialUseAudio,
      video: this.initialUseVideo,
    };
    const tracks = [];
    if (this.initialUseVideo) {
      tracks.push({ type: 'video', capture: true });
    }
    if (this.initialUseAudio) {
      tracks.push({ type: 'audio', capture: true });
    }
    this.createOffer(tracks, request);
  }

  private createOffer(
    tracks: any[],
    configureRequest: any,
  ): void {
    this.mainPlugin.createOffer({
      tracks,
      success: jsep => this.mainPlugin.send({
        message: configureRequest,
        jsep,
      }),
      customizeSdp: jsep => {
        if (doDtx) {
          jsep.sdp = jsep.sdp.replace('useinbandfec=1', 'useinbandfec=1;usedtx=1');
        }
      },
      error: error => Janus.error('WebRTC error:', error),
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
