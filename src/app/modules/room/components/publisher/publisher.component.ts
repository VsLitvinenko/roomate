import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { JanusJS } from '../../janus/janus.interfaces';
import { Janus } from '../../janus/janus.constants';

@Component({
  selector: 'app-publisher',
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.scss'],
})
export class PublisherComponent implements OnInit {
  @Input() publisher: JanusJS.Publisher;
  @Input() myPrivateId: number;
  @Input() roomId: number;
  @Input() sessionAttach: (options: JanusJS.PluginOptions) => void;

  @ViewChild('videoEl')
  private readonly videoEl: ElementRef<HTMLVideoElement>;

  public videoVolume = 100;

  private publisherHandle: JanusJS.PluginHandle;
  private bufferRemoteTracks: MediaStreamTrack[] = [];

  constructor() { }

  ngOnInit() {
    this.sessionAttach({
      plugin: 'janus.plugin.videoroom',
      success: pluginHandle => this.publisherPluginHandling(pluginHandle),
      error: error => Janus.error('publisher attaching error', error),
      onmessage: (msg, jsep) => this.onPublisherMessage(msg, jsep),
      onremotetrack: (track, mid, on) => this.onRemoteTrack(track),
    });
  }

  private publisherPluginHandling(plugin: JanusJS.PluginHandle): void {
    this.publisherHandle = plugin;
    const subscription = [];
    this.publisher.streams
      ?.forEach(stream => subscription
        .push({ feed: this.publisher.id, mid: stream.mid }));

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

  private onPublisherMessage(msg: JanusJS.Message, jsep: any): void {
    if (jsep) {
      const stereo = (jsep.sdp.indexOf('stereo=1') !== -1);
      this.publisherHandle.createAnswer({
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
          this.publisherHandle.send({ message: request, jsep: currentJsep });
        },
        error: error => Janus.error('WebRTC error:', error)
      });
    }
  }

  private onRemoteTrack(track: MediaStreamTrack): void {
    if (track.muted) {
      return;
    }
    this.bufferRemoteTracks.push(track.clone());
    if (this.bufferRemoteTracks.length === 2) {
      const stream = new MediaStream();
      this.bufferRemoteTracks
        .forEach(currentTrack => stream.addTrack(currentTrack));
      Janus.attachMediaStream(this.videoEl.nativeElement, stream);
      this.bufferRemoteTracks = [];
    }
  }

}
