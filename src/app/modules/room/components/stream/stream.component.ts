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
  @Input() public tracks: MediaStreamTrack[];
  @Input() public index: number;

  @ViewChild('videoEl') private readonly videoEl: ElementRef<HTMLVideoElement>;
  @ViewChild('modal') private readonly modal: IonModal;
  @ViewChild('popover') private readonly popover: IonPopover;

  public videoVolume = 100;
  public modalLoading = false;

  private remoteStream: MediaStream;
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
    if (changes.tracks) {
      this.playerReady.subscribe(() => {
        this.remoteStream = new MediaStream();
        this.tracks.forEach(track => this.remoteStream.addTrack(track));
        Janus.attachMediaStream(this.videoEl.nativeElement, this.remoteStream);
      });
    }
  }

  ngAfterViewInit(): void {
    this.playerReady$.next(true);
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
        const modalVideoEl = document
          .getElementById(`modal-video-el-${this.index}`) as HTMLVideoElement;
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
}
