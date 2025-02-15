import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { Janus } from '../../janus';
import { IonModal, IonPopover } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';

const SIN_FUNC = x => 0.5 * ((Math.sin((x - 0.5) * Math.PI)) + 1);

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss'],
})
export class StreamComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() public display: string;
  @Input() public imageUrl: string;
  @Input() public videoTrack: MediaStreamTrack;
  @Input() public audioTrack: MediaStreamTrack;
  @Input() public id: string | number;
  @Input() public localStream: boolean;
  @Input() public outputDeviceId: string;

  @ViewChild('speakerBorder') private readonly speakerBorder: ElementRef<HTMLElement>;
  @ViewChild('audioEl') private readonly audioEl: ElementRef<HTMLAudioElement>;
  @ViewChild('videoEl') private readonly videoEl: ElementRef<HTMLVideoElement>;

  @ViewChild('modal') private readonly modal: IonModal;
  @ViewChild('popover') private readonly popover: IonPopover;

  public audioVolume: number;
  public modalLoading$ = new BehaviorSubject<boolean>(false);

  private remoteVideoStream: MediaStream;
  private remoteAudioStream: MediaStream;
  private playerReady$ = new BehaviorSubject(false);

  private audioTrackNode: AudioNode = null;

  constructor() { }

  public get popoverId(): string {
    return `popover-${this.localStream ? 'local' : 'remote'}-${this.id}`;
  }

  public get modalVideoElId(): string {
    return `modal-video-el-${this.localStream ? 'local' : 'remote'}-${this.id}`;
  }

  private get playerReady(): Observable<boolean> {
    return this.playerReady$.pipe(
      filter(ready => ready),
      take(1)
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.localStream) {
      this.audioVolume = this.localStream ? 0 : 100;
    }
    // set tracks only after view init
    this.playerReady.subscribe(() => {
      if (changes.videoTrack) {
        this.trackHandler(this.videoTrack, 'video');
      }
      if (changes.audioTrack) {
        this.trackHandler(this.audioTrack, 'audio');
      }
      if (changes.outputDeviceId) {
        (this.audioEl.nativeElement as any).setSinkId(this.outputDeviceId);
      }
    });
  }

  ngAfterViewInit(): void {
    this.playerReady$.next(true);
  }

  async ngOnDestroy(): Promise<void> {
    await this.closeModal();
    await this.popover.dismiss();
  }

  public setVolume(volume: number): void {
    this.audioVolume = volume;
  }

  public openPopover(): void {
    this.popover.present().then();
  }

  public openModal(): void {
    this.modalLoading$.next(true);
    this.modal.present().then(() => {
      const modalVideoEl = document.getElementById(this.modalVideoElId) as HTMLVideoElement;
      this.videoEl.nativeElement.srcObject = null;
      Janus.attachMediaStream(modalVideoEl, this.remoteVideoStream);
      this.modalLoading$.next(false);
    });
  }

  public async closeModal(): Promise<boolean> {
    return this.modal.dismiss();
  }

  public onModalWillClose(): void {
    this.videoEl.nativeElement.srcObject = this.remoteVideoStream;
  }

  private trackHandler(track: MediaStreamTrack | null, kind: 'video' | 'audio'): void {
    const attachEl = (kind === 'video' ? this.videoEl : this.audioEl).nativeElement;
    let stream;
    if (track === null) {
      stream = null;
      if (kind === 'audio' && this.audioTrackNode !== null) {
        // reset speaker border control
        this.audioTrackNode.disconnect();
        this.audioTrackNode = null;
        this.speakerBorder.nativeElement.style.opacity = '0';
      }
    }
    else {
      stream = new MediaStream();
      stream.addTrack(track);
      if (kind === 'video') {
        this.remoteVideoStream = stream;
      }
      else {
        this.remoteAudioStream = stream;
        this.audioTrackLevel().then();
      }
    }
    setTimeout(() => Janus.attachMediaStream(attachEl, stream), 0);
  }

  private async audioTrackLevel(): Promise<void> {
    // if track was replaced
    this.audioTrackNode?.disconnect();

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    await audioContext.audioWorklet.addModule('/assets/vumeter/vumeter-processor.js');
    const node = new AudioWorkletNode(audioContext, 'vumeter');

    this.audioTrackNode = audioContext.createMediaStreamSource(this.remoteAudioStream);
    this.audioTrackNode.connect(node).connect(audioContext.destination);
    this.speakerBorderControl(node);
  }

  private speakerBorderControl(node: AudioWorkletNode) {
    const maxCounter = 15;
    let lastMaxRes = 0;
    let counter = 0;

    // updateInterval is 100ms
    node.port.onmessage = event => {
      if (!event.data.volume) {
        return;
      }
      const x = event.data.volume * 5;
      const res = x > 1 ? 1 : SIN_FUNC(x);
      if (res > lastMaxRes || counter === maxCounter) {
        // max value during last 1.5 sec
        counter = 0;
        lastMaxRes = res;
        this.speakerBorder.nativeElement.style.opacity = res.toString();
      }
      counter += 1;
    };
  }
}
