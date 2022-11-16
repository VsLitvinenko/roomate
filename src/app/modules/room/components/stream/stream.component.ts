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

  @ViewChild('videoEl') private readonly videoEl: ElementRef<HTMLVideoElement>;
  @ViewChild('audioEl') private readonly audioEl: ElementRef<HTMLAudioElement>;
  @ViewChild('modal') private readonly modal: IonModal;
  @ViewChild('popover') private readonly popover: IonPopover;

  public audioVolume = 100;
  public modalLoading = false;

  private remoteVideoStream: MediaStream;
  private remoteAudioStream: MediaStream;
  private playerReady$ = new BehaviorSubject(false);

  constructor() { }

  private get playerReady(): Observable<void> {
    return this.playerReady$.pipe(
      filter(ready => ready),
      mapTo(void 0),
      take(1)
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
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

  public openPopover(): void {
    this.popover.present().then();
  }

  public openModal(): void {
    this.modalLoading = true;
    this.modal.present()
      .then(() => {
        const modalVideoEl = document
          .getElementById(`modal-video-el-${this.index}`) as HTMLVideoElement;
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
      }
    }
    setTimeout(() => Janus.attachMediaStream(attachEl, stream), 0);
  }
}
