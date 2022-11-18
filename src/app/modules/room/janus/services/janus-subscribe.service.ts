import { Injectable } from '@angular/core';
import { JanusJS } from '../janus.types';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, mapTo, take } from 'rxjs/operators';
import { Janus } from '../janus.constants';

interface PublisherMid {
  publisherId: number;
  subMid: string;
}

@Injectable()
export class JanusSubscribeService {

  public readonly remoteTracks: { [publisherId: number]: JanusJS.PublisherTracks } = {};
  private readonly mids: { [mid: string]: PublisherMid } = {};

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


  public onUpdatePublisher(publisher: JanusJS.Publisher): void {
    // new publisher
    if (!this.remoteTracks[publisher.id]) {
      this.remoteTracks[publisher.id] = {
        display: publisher.display,
        // would be attached in onRemoteTrack()
        videoTrack: null,
        audioTrack: null
      };
    }
    this.receivePluginReady.subscribe(() => {
      const midsValues = Object.values(this.mids)
        .filter(item => item.publisherId === publisher.id);
      // streams for request
      const subscribe = [];
      const unsubscribe = [];

      publisher.streams.forEach(stream => {
        const existingStream = midsValues.some(item => item.subMid === stream.mid);
        if (!existingStream && !stream.disabled) {
          // literally new stream we want to subscribe
          subscribe.push({
            feed: publisher.id,
            mid: stream.mid
          });
        }
        else if (stream.disabled && existingStream) {
          // newly disabled stream
          switch (stream.type) {
            case 'audio':
              this.remoteTracks[publisher.id].audioTrack = null;
              break;
            case 'video':
              this.remoteTracks[publisher.id].videoTrack = null;
              break;
          }
          unsubscribe.push({
            feed: publisher.id,
            mid: stream.mid
          });
        }
      });

      console.warn(subscribe, 'SUB');
      console.warn(unsubscribe, 'UNSUB');

      this.sendMessage(subscribe, unsubscribe);
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
      console.warn(msg.streams, 'STREAMS');
      msg.streams.forEach(stream => {
        if (stream.active === false) {
          // disabled stream
          delete this.mids[stream.mid];
        }
        else {
          // new stream
          this.mids[stream.mid] = {
            publisherId: stream.feed_id,
            subMid: stream.feed_mid
          };
        }
      });
    }
    if (jsep) {
      const stereo = (jsep.sdp.indexOf('stereo=1') !== -1);
      const tracks = (msg as any).videoroom === 'attached' ?
        [ { type: 'data' } ] : undefined;

      this.plugin.createAnswer({
        jsep,
        tracks,
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

  private sendMessage(subscribe: any[], unsubscribe: any[]): void {
    if (subscribe.length === 0 && unsubscribe.length === 0) {
      return;
    }
    let message: any;
    if (this.firstSubscribeDone) {
      // update request
      message = { request: 'update' };
      if (subscribe.length) {
        message.subscribe = subscribe;
      }
      if (unsubscribe.length) {
        message.unsubscribe = unsubscribe;
      }
    }
    else {
      // join request
      this.firstSubscribeDone = true;
      message = {
        request: 'join',
        room: this.roomId,
        ptype: 'subscriber',
        streams: subscribe,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        private_id: this.myPrivateId,
      };
    }

    this.plugin.send({ message });
  }

  private onRemoteTrack(track: MediaStreamTrack, mid: string, on: boolean): void {
    // if (on && !track.muted) {
    if (on) {
      // new publisher
      const publisherId = this.mids[mid].publisherId;
      console.warn(publisherId, track.kind, this.remoteTracks[publisherId].display);
      switch (track.kind) {
        case 'audio':
          this.remoteTracks[publisherId].audioTrack = track;
          break;
        case 'video':
          this.remoteTracks[publisherId].videoTrack = track;
          break;
      }
    }
  }

}
