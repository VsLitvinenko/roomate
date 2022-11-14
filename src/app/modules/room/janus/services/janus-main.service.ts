import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, mapTo, take } from 'rxjs/operators';
import { acodec, doDtx, doSimulcast, Janus, vcodec } from '../janus.constants';
import { JanusJS } from '../janus.types';
import { JanusSubscribeService, PublisherTracks } from './janus-subscribe.service';
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

  public get remoteTracks(): { [publisherId: number]: PublisherTracks } {
    return this.receiveService.remoteTracks;
  }

  public toggleAudio(muted: boolean): void {
    if (muted) {
      this.mainPlugin.muteAudio();
    } else  {
      this.mainPlugin.unmuteAudio();
    }
  }

  public toggleVideo(muted: boolean): void {
    let media;
    if (muted) {
      media = { removeVideo: true };
      this.mainPlugin.muteVideo();
    } else  {
      media = { addVideo: true };
      this.mainPlugin.unmuteVideo();
    }
    this.mainPlugin.createOffer({
      success: (jsep) => this.mainPlugin.send({
        message: {audio: true, video: true},
        jsep
      }),
      media,
    });
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

  public shareScreen(share: boolean): void {
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
      msg.publishers
        .filter(publisher => this.myScreenPublishId === undefined || publisher.id !== this.myScreenPublishId)
        .forEach(publisher => this.receiveService.onNewPublisher(publisher));
    }
    if ((msg as any).leaving) {
      this.receiveService.onDeletePublisher((msg as any).leaving);
    }
    if (jsep) {
      this.mainPlugin.handleRemoteJsep({ jsep });
    }
  }

  private onJoinedRoom(msg: JanusJS.Message): void {
    this.mainPlugin.createOffer({
      media: { audioRecv: false, videoRecv: false, audioSend: true, videoSend: true },
      simulcast: doSimulcast,
      success: jsep => {
        this.initialConfigure(jsep);
        this.receiveService.attachPlugin(this.janus.attach, (msg as any).private, this.roomId);
      },
      error: error => Janus.error('WebRTC error:', error),
      customizeSdp: jsep => {
        if (doDtx) {
          jsep.sdp = jsep.sdp.replace('useinbandfec=1', 'useinbandfec=1;usedtx=1');
        }
      }
    });
  }

  private initialConfigure(jsep): void {
    const request = {
      request: 'configure',
      audio: true,
      video: true,
      audiocodec: acodec || undefined,
      videocodec: vcodec || undefined
    };
    this.mainPlugin.send({
      success: () => this.roomConfigured$.next(true),
      message: request,
      jsep
    });
  }

  private onLocalTrack(track: MediaStreamTrack): void {
    if (track.kind === 'video') {
      const stream = new MediaStream();
      stream.addTrack(track.clone());
      // this.localStream$$.next(stream);
    }
  }
}
