import {Component, OnInit, ViewChild} from '@angular/core';
import { JanusJS } from '../types/janus.interfaces';
import {acodec, doDtx, doOpusred, doSimulcast, doSvc, vcodec, vprofile} from './janus.constants';
import adapter from 'webrtc-adapter';
import { IonContent } from '@ionic/angular';

(window as any).adapter = adapter;
// eslint-disable-next-line @typescript-eslint/naming-convention
const Janus = (window as any).Janus;
const currentToken = '1649527254,janus,janus.plugin.videoroom:dEZZZXaIW/P83gn4P7lfleFp4WM=';
const currentRoom = 1234;

@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
})
export class RoomPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  private janus: JanusJS.Janus;
  private mainPlugin: JanusJS.PluginHandle;
  private myPrivateId: number;
  private publishersHandles: { [key: number]: JanusJS.PluginHandle } = {};

  private bufferLocalTracks = [];
  private bufferRemoteTracks = [];

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
      // server: 'wss://janus.conf.meetecho.com/ws',
      success: () => this.mainPluginAttaching(),
      error: () => console.log('connection error?'),
      destroyed: () => {},
      // token
    });
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
      room: currentRoom,
      ptype: 'publisher',
      display: `tohaloh${Math.random() * 100}`
    };
    this.mainPlugin.send({ message: request });
  }

  private onMainMessage(msg: JanusJS.Message, jsep: JanusJS.JSEP): void {
    if ((msg as any).videoroom === 'joined') {
      this.onJoinRoom(msg);
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

  private onJoinRoom(msg: JanusJS.Message): void {
    const useAudio = true;
    this.myPrivateId = (msg as any).private_id;
    this.mainPlugin.createOffer({
      media: { audioRecv: false, videoRecv: false, audioSend: useAudio, videoSend: true },
      simulcast: doSimulcast,
      success: jsep => {
        const request = {
          request: 'configure',
          audio: useAudio,
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

  private onNewPublisher(publisher: JanusJS.Publisher): void {
    this.janus.attach({
      plugin: 'janus.plugin.videoroom',
      success: pluginHandle => this.publisherPluginHandling(publisher, pluginHandle),
      error: error => Janus.error('publisher attaching error', error),
      onmessage: (msg, jsep) => this.onPublisherMessage(publisher, msg, jsep),
      onremotetrack: (track, mid, on) => this.onRemoteTrack(track, mid, on, publisher.id),
    });
  }

  private publisherPluginHandling(
    publisher: JanusJS.Publisher,
    plugin: JanusJS.PluginHandle
  ): void {
    this.publishersHandles[publisher.id] = plugin;
    const subscription = [];
    publisher.streams
      ?.forEach(stream => subscription
        .push({ feed: publisher.id, mid: stream.mid }));
    const request = {
      request: 'join',
      room: currentRoom,
      ptype: 'subscriber',
      streams: subscription,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      private_id: this.myPrivateId
    };
    plugin.send({ message: request });
  }

  private onPublisherMessage(
    publisher: JanusJS.Publisher,
    msg: JanusJS.Message,
    jsep: any
  ): void {
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
          const request = { request: 'start', room: currentRoom };
          this.publishersHandles[publisher.id].send({ message: request, jsep: currentJsep });
        },
        error: error => Janus.error('WebRTC error:', error)
      });
    }
  }

  private onRemoteTrack(track: MediaStreamTrack, mid: any, on: boolean, publisherId: number): void {
    if (track.muted) {
      return;
    }
    this.bufferRemoteTracks.push(track.clone());
    if (this.bufferRemoteTracks.length === 2) {
      const stream = new MediaStream();
      this.bufferRemoteTracks
        .forEach(currentTrack => stream.addTrack(currentTrack));
      this.createVideoElement(stream, `publisher${publisherId}`);
      this.bufferRemoteTracks = [];
    }
  }

  private onDeletePublisher(publisherId: number): void {
    delete this.publishersHandles[publisherId];
    document.getElementById(`publisher${publisherId}`).remove();
  }

  private onLocalTrack(track: MediaStreamTrack, on: boolean): void {
    if (track.kind === 'video') {
      const stream = new MediaStream();
      stream.addTrack(track.clone());
      this.createVideoElement(stream, 'localstream');
    }
  }

  private createVideoElement(stream: MediaStream, id: string): void {
    const video = document.createElement('video');
    video.playsInline = true;
    video.muted = false;
    video.autoplay = true;
    video.id = id;
    Janus.attachMediaStream(video, stream);
    (this.content as any).el.appendChild(video);
  }
}
