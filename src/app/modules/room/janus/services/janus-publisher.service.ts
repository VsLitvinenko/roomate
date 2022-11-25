import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable, Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { doDtx, Janus } from '../janus.constants';
import { JanusJS } from '../janus.types';

@Injectable()
export class JanusPublisherService {
  public localPublisher$$ = new BehaviorSubject<JanusJS.PublisherTracks>({
    display: 'You',
    audio: null,
    video: null
  });

  public updatePublishers$ = new Subject<JanusJS.Publisher[]>();
  public deletePublisher$ = new Subject<number>();

  private myPrivateId$ = new Subject<number>();
  private roomConfigured$ = new BehaviorSubject<boolean>(false);
  private mainPlugin: JanusJS.PluginHandle;

  private roomId: number;
  private initialUseAudio: boolean;
  private initialUseVideo: boolean;

  private streams: any[];

  constructor() { }

  public get roomConfigured(): Observable<boolean> {
    return this.roomConfigured$.pipe(
      filter(ready => ready),
      take(1)
    );
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

  public replaceDevice(deviceId: string, type: 'audio' | 'video'): void {
    const currentStream = this.streams.find(item => !item.disabled && item.type === type);
    const tracks = [{
      type,
      mid: currentStream.mid,
      capture: { deviceId: { exact: deviceId } }
    }];
    this.mainPlugin.replaceTracks({ tracks });
  }

  public attachPlugin(
    sessionAttach: (options: JanusJS.PluginOptions) => void,
    roomId: number,
    useAudio: boolean,
    useVideo: boolean
  ): Promise<number> {
    this.roomId = roomId;
    this.initialUseAudio = useAudio;
    this.initialUseVideo = useVideo;
    sessionAttach({
      plugin: 'janus.plugin.videoroom',
      success: pluginHandle => this.mainPluginHandling(pluginHandle),
      error: error => Janus.error('pluginAttaching error:', error),
      onmessage: (message, jsep) => this.onMainMessage(message, jsep),
      onlocaltrack: (track, on) => this.onLocalTrack(track, on),
    });

    return firstValueFrom(this.myPrivateId$);
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
      this.updatePublishers$.next(msg.publishers);
    }
    if ((msg as any).leaving) {
      this.deletePublisher$.next((msg as any).leaving);
    }
    if (msg.streams) {
      this.streams = msg.streams;
    }
    if (jsep) {
      this.mainPlugin.handleRemoteJsep({ jsep });
    }
  }

  private onJoinedRoom(msg: JanusJS.Message): void {
    this.myPrivateId$.next((msg as any).private);

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
    this.createOffer(tracks, request, () => this.roomConfigured$.next(true));
  }

  private createOffer(
    tracks: any[],
    configureRequest: any,
    successHandler = () => undefined
  ): void {
    this.mainPlugin.createOffer({
      tracks,
      success: jsep => {
        this.mainPlugin.send({
          message: configureRequest,
          jsep,
        });
        successHandler();
      },
      customizeSdp: jsep => {
        if (doDtx) {
          jsep.sdp = jsep.sdp.replace('useinbandfec=1', 'useinbandfec=1;usedtx=1');
        }
      },
      error: error => Janus.error('WebRTC error:', error),
    });
  }

  private onLocalTrack(track: MediaStreamTrack, on: boolean): void {
    const localPublisher = this.localPublisher$$.value;
    this.localPublisher$$.next({
      ...localPublisher,
      [track.kind]: on ? track : null
    });
  }
}
