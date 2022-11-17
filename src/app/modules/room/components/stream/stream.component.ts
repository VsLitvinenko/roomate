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
import { Janus } from '../../janus/janus.constants';
import { IonModal, IonPopover } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, mapTo, take } from 'rxjs/operators';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss'],
})
export class StreamComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() public display: string;
  @Input() public videoTrack: MediaStreamTrack;
  @Input() public audioTrack: MediaStreamTrack;
  @Input() public index: number;
  @Input() public localStream: boolean;

  @ViewChild('speakerBorder') private readonly speakerBorder: ElementRef<HTMLElement>;
  @ViewChild('videoEl') private readonly videoEl: ElementRef<HTMLVideoElement>;
  @ViewChild('audioEl') private readonly audioEl: ElementRef<HTMLAudioElement>;
  @ViewChild('modal') private readonly modal: IonModal;
  @ViewChild('popover') private readonly popover: IonPopover;

  public audioVolume: number;
  public modalLoading = false;

  private remoteVideoStream: MediaStream;
  private remoteAudioStream: MediaStream;
  private playerReady$ = new BehaviorSubject(false);

  private vumeterNode: AudioWorkletNode;

  constructor() { }

  public get popoverId(): string {
    return `popover-${this.localStream ? 'local' : 'remote'}${this.index}`;
  }

  public get modalVideoElId(): string {
    return `modal-video-el-${this.localStream ? 'local' : 'remote'}${this.index}`;
  }

  private get playerReady(): Observable<void> {
    return this.playerReady$.pipe(
      filter(ready => ready),
      mapTo(void 0),
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
    this.modalLoading = true;
    this.modal.present()
      .then(() => {
        const modalVideoEl = document.getElementById(this.modalVideoElId) as HTMLVideoElement;
        this.videoEl.nativeElement.srcObject = null;

        Janus.attachMediaStream(modalVideoEl, this.remoteVideoStream);
        this.modalLoading = false;
      });
  }

  public async closeModal(): Promise<boolean> {
    return this.modal.dismiss();
  }

  public onModalWillClose(): void {
    this.videoEl.nativeElement.srcObject = this.remoteVideoStream;
  }

  private trackHandler(track: MediaStreamTrack, kind: 'video' | 'audio'): void {
    const attachEl = (kind === 'video' ? this.videoEl : this.audioEl).nativeElement;
    let stream;
    if (track === null) {
      stream = null;
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
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const microphone = audioContext.createMediaStreamSource(this.remoteAudioStream);
    const node = await this.getVumeterNode(audioContext);
    this.speakerBorderControl(node);
    microphone.connect(node).connect(audioContext.destination);
  }

  private async getVumeterNode(context: AudioContext): Promise<AudioWorkletNode> {
    if (!this.vumeterNode) {
      await context.audioWorklet.addModule('/assets/vumeter/vumeter-processor.js');
      this.vumeterNode = new AudioWorkletNode(context, 'vumeter');
    }
    return this.vumeterNode;
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
      const res = Math.round(
        event.data.volume * 1000 / 2.5
      ) / 100;
      if (res > lastMaxRes || counter === maxCounter) {
        // max value during last 1.5 sec
        lastMaxRes = res;
        this.speakerBorder.nativeElement.style.opacity = res.toString();
      }
      counter += 1;
      if (counter > maxCounter) {
        counter = 0;
      }
    };
  }
}
