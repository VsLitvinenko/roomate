import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { acodec, doDtx, doSimulcast, Janus, vcodec } from './janus.constants';
import { JanusJS } from './janus.interfaces';

export interface RoomReady {
  sessionAttach: (options: JanusJS.PluginOptions) => void;
  privateId: number;
}

const token = '1649527254,janus,janus.plugin.videoroom:dEZZZXaIW/P83gn4P7lfleFp4WM=';

@Injectable()
export class JanusService {

  private newPublisher$$ = new Subject<JanusJS.Publisher>();
  private deletePublisher$$ = new Subject<number>();
  private localStream$$ = new Subject<MediaStream>();

  private roomReady$$ = new BehaviorSubject<RoomReady>(null);

  private janusReady$ = new BehaviorSubject<boolean>(false);
  private janus: JanusJS.Janus;

  private roomId: number;
  private mainPlugin: JanusJS.PluginHandle;

  constructor() {
    Janus.init({
      debug: true,
      dependencies: Janus.useDefaultDependencies(null),
      callback: () => this.janusReady$.next(true)
    });
  }

  public get newPublisher$(): Observable<JanusJS.Publisher> {
    return this.newPublisher$$.asObservable();
  }

  public get deletePublisher$(): Observable<number> {
    return this.deletePublisher$$.asObservable();
  }

  public get localStream$(): Observable<MediaStream> {
    return this.localStream$$.asObservable();
  }

  public roomReady$(): Observable<RoomReady> {
    return this.roomReady$$.pipe(
      filter(value => value !== null),
      take(1)
    );
  }

  public joinRoom(roomId: number): void {
    this.roomId = roomId;
    this.createSession();
  }

  public toggleAudio(muted: boolean): void {
    this.roomReady$().subscribe(() => {
      if (muted) {
        this.mainPlugin.muteAudio();
      } else  {
        this.mainPlugin.unmuteAudio();
      }
    });
  }

  public toggleVideo(muted: boolean): void {
    this.roomReady$().subscribe(() => {
      if (muted) {
        this.mainPlugin.muteVideo();
      } else  {
        this.mainPlugin.unmuteVideo();
      }
    });
  }

  private createSession(): void {
    this.janusReady$.pipe(
      filter(ready => ready),
      take(1)
    ).subscribe(() => this.janus = new Janus({
        server: 'https://80-78-247-250.cloudvps.regruhosting.ru/janusbase/janus/',
        success: () => this.mainPluginAttaching(),
        error: error => Janus.error('Roomate session creating error', error),
        token
      }));
  }

  private mainPluginAttaching(): void {
    this.janus.attach({
      plugin: 'janus.plugin.videoroom',
      success: pluginHandle => this.mainPluginHandling(pluginHandle),
      error: error => Janus.error('pluginAttaching error:', error),
      onmessage: (message, jsep) => this.onMainMessage(message, jsep),
      onlocaltrack: (track, on) => this.onLocalTrack(track),
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
    if (msg.publishers?.length) {
      msg.publishers.forEach(publisher => this.onNewPublisher(publisher));
    }
    if ((msg as any).unpublished) {
      this.onDeletePublisher((msg as any).unpublished);
    }
    if (jsep) {
      this.mainPlugin.handleRemoteJsep({ jsep });
    }
  }

  private onJoinedRoom(msg: JanusJS.Message): void {
    this.mainPlugin.createOffer({
      media: { audioRecv: false, videoRecv: false, audioSend: true, videoSend: true },
      simulcast: doSimulcast,
      success: jsep => this.initialConfigure((msg as any).private, jsep),
      error: error => Janus.error('WebRTC error:', error),
      customizeSdp: jsep => {
        if (doDtx) {
          jsep.sdp = jsep.sdp.replace('useinbandfec=1', 'useinbandfec=1;usedtx=1');
        }
      }
    });
  }

  private initialConfigure(privateId: number, jsep): void {
    const request = {
      request: 'configure',
      audio: true,
      video: true,
      audiocodec: acodec || undefined,
      videocodec: vcodec || undefined
    };
    this.mainPlugin.send({
      success: () => this.roomReady$$.next({
        sessionAttach: this.janus.attach,
        privateId,
      }),
      message: request,
      jsep
    });
  }

  private onNewPublisher(newPublisher: JanusJS.Publisher): void {
    this.newPublisher$$.next(newPublisher);
  }

  private onDeletePublisher(publisherId: number): void {
    this.deletePublisher$$.next(publisherId);
  }

  private onLocalTrack(track: MediaStreamTrack): void {
    if (track.kind === 'video') {
      const stream = new MediaStream();
      stream.addTrack(track.clone());
      this.localStream$$.next(stream);
    }
  }
}
