import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { acodec, doDtx, doSimulcast, Janus, vcodec } from './janus.constants';
import { JanusJS } from './janus.interfaces';

export interface RemoteStream {
  stream: MediaStream;
  publisher: JanusJS.Publisher;
}

@Injectable()
export class JanusService {
  public newRemoteStream$ = new Subject<RemoteStream>();
  public localStream$ = new Subject<MediaStream>();

  private janusReady$ = new BehaviorSubject<boolean>(false);
  private janus: JanusJS.Janus;

  private roomId: number;
  private myPrivateId: number;
  private mainPlugin: JanusJS.PluginHandle;
  private publishersHandles: { [key: number]: JanusJS.PluginHandle } = {};

  private bufferRemoteTracks: MediaStreamTrack[] = [];

  constructor() {
    Janus.init({
      debug: true,
      dependencies: Janus.useDefaultDependencies(null),
      callback: () => this.janusReady$.next(true)
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
        server: 'https://80-78-247-250.cloudvps.regruhosting.ru/janusbase/janus/',
        success: () => this.mainPluginAttaching(),
        error: error => Janus.error('Roomate session creating error', error)
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
    this.myPrivateId = (msg as any).private_id;
    this.mainPlugin.createOffer({
      media: { audioRecv: false, videoRecv: false, audioSend: true, videoSend: true },
      simulcast: doSimulcast,
      success: jsep => {
        const request = {
          request: 'configure',
          audio: true,
          video: true,
          audiocodec: acodec || undefined,
          videocodec: vcodec || undefined
        };
        this.mainPlugin.send({ message: request, jsep });
      },
      error: error => Janus.error('WebRTC error:', error),
      customizeSdp: jsep => {
        if (doDtx) {
          jsep.sdp = jsep.sdp.replace('useinbandfec=1', 'useinbandfec=1;usedtx=1');
        }
      }
    });
  }

  private onDeletePublisher(publisherId: number): void {
    delete this.publishersHandles[publisherId];
    // document.getElementById(`publisher${publisherId}`).remove();
  }

  private onNewPublisher(publisher: JanusJS.Publisher): void {
    this.janus.attach({
      plugin: 'janus.plugin.videoroom',
      success: pluginHandle => this.publisherPluginHandling(publisher, pluginHandle),
      error: error => Janus.error('publisher attaching error', error),
      onmessage: (msg, jsep) => this.onPublisherMessage(publisher, msg, jsep),
      onremotetrack: (track, mid, on) => this.onRemoteTrack(track, publisher),
    });
  }

  private publisherPluginHandling(publisher: JanusJS.Publisher, plugin: JanusJS.PluginHandle): void {
    this.publishersHandles[publisher.id] = plugin;
    const subscription = [];
    publisher.streams
      ?.forEach(stream => subscription
        .push({ feed: publisher.id, mid: stream.mid }));

    const request = {
      request: 'join',
      room: this.roomId,
      ptype: 'subscriber',
      streams: subscription,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      private_id: this.myPrivateId
    };
    plugin.send({ message: request });
  }

  private onPublisherMessage(publisher: JanusJS.Publisher, msg: JanusJS.Message, jsep: any): void {
    if (jsep) {
      const stereo = (jsep.sdp.indexOf('stereo=1') !== -1);
      this.publishersHandles[publisher.id].createAnswer({
        jsep,
        media: { audioSend: false, videoSend: false },
        customizeSdp: currentJsep => {
          if (stereo && currentJsep.sdp.indexOf('stereo=1') === -1) {
            // Make sure that our offer contains stereo too
            currentJsep.sdp = currentJsep.sdp.replace('useinbandfec=1', 'useinbandfec=1;stereo=1');
          }
        },
        success: currentJsep => {
          const request = { request: 'start', room: this.roomId };
          this.publishersHandles[publisher.id].send({ message: request, jsep: currentJsep });
        },
        error: error => Janus.error('WebRTC error:', error)
      });
    }
  }

  private onRemoteTrack(track: MediaStreamTrack, publisher: JanusJS.Publisher): void {
    if (track.muted) {
      return;
    }
    this.bufferRemoteTracks.push(track.clone());
    if (this.bufferRemoteTracks.length === 2) {
      const stream = new MediaStream();
      this.bufferRemoteTracks
        .forEach(currentTrack => stream.addTrack(currentTrack));
      this.bufferRemoteTracks = [];
      this.newRemoteStream$.next({ stream, publisher });
    }
  }

  private onLocalTrack(track: MediaStreamTrack): void {
    if (track.kind === 'video') {
      const stream = new MediaStream();
      stream.addTrack(track.clone());
      this.localStream$.next(stream);
    }
  }
}
