import { Injectable } from '@angular/core';
import { JanusJS } from '../janus.types';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, mapTo, take } from 'rxjs/operators';
import { Janus } from '../janus.constants';

export interface PublisherTracks {
  display: string;
  tracks: MediaStreamTrack[];
}

@Injectable()
export class JanusSubscribeService {

  public readonly remoteTracks: { [publisherId: number]: PublisherTracks } = {};
  private readonly mids: { [mid: string]: number } = {};

  private pluginReady$ = new BehaviorSubject(false);
  private plugin: JanusJS.PluginHandle;

  private myPrivateId: number;
  private roomId: number;
  private firstSubscribeDone = false;

  constructor() { }

  private get receivePluginReady(): Observable<void> {
    return this.pluginReady$.pipe(
      filter(ready => ready),
      mapTo(void 0),
      take(1)
    );
  }

  public attachPlugin(
    sessionAttach: (options: JanusJS.PluginOptions) => void,
    privateId: number,
    roomId: number
  ): void {
    if (this.pluginReady$.value) {
      // do nothing if plugin is already exist
      return;
    }
    this.myPrivateId = privateId;
    this.roomId = roomId;
    sessionAttach({
      plugin: 'janus.plugin.videoroom',
      success: pluginHandle => this.handlePlugin(pluginHandle),
      error: error => Janus.error('publisher attaching error', error),
      onmessage: (msg, jsep) => this.onMessage(msg, jsep),
      onremotetrack: (track, mid, on) => this.onRemoteTrack(track, mid, on),
    });
  }


  public onNewPublisher(publisher: JanusJS.Publisher): void {
    this.receivePluginReady.subscribe(() => {
      this.remoteTracks[publisher.id] = {
        display: publisher.display,
        tracks: [] // would attached in onRemoteTrack()
      };
      const subscription = [];
      publisher.streams?.forEach(
        stream => subscription.push({
          feed: publisher.id,
          mid: stream.mid
        })
      );
      const message = this.getSubscribeRequestMessage(subscription);
      this.plugin.send({ message });
    });
  }

  public onDeletePublisher(publisherId: number): void {
    this.receivePluginReady.subscribe(() => {
      const message = {
        request: 'unsubscribe',
        streams: [{ feed: publisherId }]
      };
      this.plugin.send({
        message,
        success: () => delete this.remoteTracks[publisherId]
      });
    });
  }

  private handlePlugin(plugin: JanusJS.PluginHandle): void {
    this.plugin = plugin;
    this.pluginReady$.next(true);
  }

  private onMessage(msg: JanusJS.Message, jsep: any): void {
    if (msg.streams) {
      msg.streams
        .filter(stream => stream.active)
        .forEach(stream => this.mids[stream.mid] = stream.feed_id);
    }
    if (jsep) {
      const stereo = (jsep.sdp.indexOf('stereo=1') !== -1);
      this.plugin.createAnswer({
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
          this.plugin.send({ message: request, jsep: currentJsep });
        },
        error: error => Janus.error('WebRTC error:', error)
      });
    }
  }

  private onRemoteTrack(track: MediaStreamTrack, mid: string, on: boolean): void {
    if (!on) {
      delete this.mids[mid];
      return;
    }
    if (track.muted) {
      return;
    }
    const publisherId = this.mids[mid];
    this.remoteTracks[publisherId].tracks.push(track.clone());
  }

  private getSubscribeRequestMessage(subscription): any {
    if (this.firstSubscribeDone) {
      return {
        request: 'subscribe',
        streams: subscription
      };
    }
    else {
      this.firstSubscribeDone = true;
      return {
        request: 'join',
        room: this.roomId,
        ptype: 'subscriber',
        streams: subscription,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        private_id: this.myPrivateId
      };
    }
  }

}
