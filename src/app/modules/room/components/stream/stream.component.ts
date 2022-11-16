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
      if (changes.videoTrack?.currentValue) {
        this.remoteVideoStream = new MediaStream();
        this.remoteVideoStream.addTrack(this.videoTrack);
        Janus.attachMediaStream(this.videoEl.nativeElement, this.remoteVideoStream);
      }
      if (changes.audioTrack?.currentValue) {
        this.remoteAudioStream = new MediaStream();
        this.remoteAudioStream.addTrack(this.audioTrack);
        Janus.attachMediaStream(this.audioEl.nativeElement, this.remoteAudioStream);
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
}
