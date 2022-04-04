import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { JanusJS } from '../../janus/janus.interfaces';
import { Janus } from '../../janus/janus.constants';
import { IonModal, IonPopover } from '@ionic/angular';

@Component({
  selector: 'app-publisher',
  templateUrl: './publisher.component.html',
  styleUrls: ['./publisher.component.scss'],
})
export class PublisherComponent implements OnInit, OnDestroy {
  @Input() publisher: JanusJS.Publisher;
  @Input() myPrivateId: number;
  @Input() roomId: number;
  @Input() sessionAttach: (options: JanusJS.PluginOptions) => void;

  @ViewChild('videoEl') private readonly videoEl: ElementRef<HTMLVideoElement>;
  @ViewChild('modal') private readonly modal: IonModal;
  @ViewChild('popover') private readonly popover: IonPopover;

  public videoVolume = 100;
  public modalLoading = false;

  private publisherHandle: JanusJS.PluginHandle;
  private remoteStream: MediaStream;
  private bufferRemoteTracks: MediaStreamTrack[] = [];

  constructor() { }

  ngOnInit(): void {
    this.sessionAttach({
      plugin: 'janus.plugin.videoroom',
      success: pluginHandle => this.publisherPluginHandling(pluginHandle),
      error: error => Janus.error('publisher attaching error', error),
      onmessage: (msg, jsep) => this.onPublisherMessage(msg, jsep),
      onremotetrack: (track, mid, on) => this.onRemoteTrack(track),
    });
  }

  ngOnDestroy(): void {
    this.closeModal().then();
    this.popover.dismiss().then();
  }

  public openPopover(): void {
    this.popover.present().then();
  }

  public openModal(): void {
    this.modalLoading = true;
    this.modal.present()
      .then(() => {
        const modalVideoEl = document.getElementById('modalVideoEl') as HTMLVideoElement;
        this.videoEl.nativeElement.srcObject = null;
        Janus.attachMediaStream(modalVideoEl, this.remoteStream);
        this.modalLoading = false;
      });
  }

  public async closeModal(): Promise<boolean> {
    return this.modal.dismiss();
  }

  public onModalWillClose(): void {
    this.videoEl.nativeElement.srcObject = this.remoteStream;
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
      this.remoteStream = new MediaStream();
      this.bufferRemoteTracks
        .forEach(currentTrack => this.remoteStream.addTrack(currentTrack));
      Janus.attachMediaStream(this.videoEl.nativeElement, this.remoteStream);
      this.bufferRemoteTracks = [];
    }
  }

}
