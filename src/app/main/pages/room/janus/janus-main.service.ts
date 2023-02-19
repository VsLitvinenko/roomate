import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { Janus } from './janus.constants';
import { JanusJS } from './janus.types';
import { JanusSubscribeService, JanusShareScreenService, JanusPublisherService } from './services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { environment } from '../../../../../environments/environment';

const token = '1652177176,janus,janus.plugin.videoroom:f/oyakOF0lBzParWZNwKhz6CCig=';
const server = `${environment.janus}/janus`;

@UntilDestroy()
@Injectable()
export class JanusMainService {
  public initialUseAudio: boolean;
  public initialUseVideo: boolean;

  private janusReady$ = new BehaviorSubject<boolean>(false);
  private janus: JanusJS.Janus;

  private roomId: number;
  private myScreenPublishId: number;

  constructor(
    private readonly publisherService: JanusPublisherService,
    private readonly subscribeService: JanusSubscribeService,
    private readonly screenService: JanusShareScreenService
  ) {
    Janus.init({
      debug: true,
      dependencies: Janus.useDefaultDependencies(null),
      callback: () => this.janusReady$.next(true)
    });
  }

  public get roomConfigured(): Observable<boolean> {
    return this.publisherService.roomConfigured;
  }

  public get remoteTracks$(): Observable<ReadonlyMap<string, JanusJS.PublisherTracks>> {
    return this.subscribeService.remoteTracks$$.pipe(
      map(res => new Map(Object.entries(res)))
    );
  }

  public get localTracks$(): Observable<JanusJS.PublisherTracks[]> {
    return combineLatest([
      this.publisherService.localPublisher$$,
      this.screenService.localScreenPublisher$$
    ]).pipe(
      map(tracks => tracks.filter(item => item !== null))
    );
  }

  public toggleAudio(muted: boolean): void {
    this.publisherService.toggleAudio(muted);
  }

  public toggleVideo(muted: boolean): void {
    this.publisherService.toggleVideo(muted);
  }

  // promise will be completed when screen plugin destroyed
  public async shareScreen(): Promise<void> {
    const event = await this.screenService.attachPlugin(this.janus.attach, this.roomId);
    this.myScreenPublishId = event.id;
    return event.sharingCanceled
      .then(() => this.myScreenPublishId = undefined);
  }

  public closeScreenSharing(): void {
    this.screenService.destroyPlugin();
  }

  public replaceDevice(deviceId: string, type: 'audio' | 'video'): void {
    this.publisherService.replaceDevice(deviceId, type);
  }

  public joinRoom(roomId: number, useAudio: boolean, useVideo: boolean): void {
    this.roomId = roomId;
    this.initialUseAudio = useAudio;
    this.initialUseVideo = useVideo;
    this.createSession();
  }

  private createSession(): void {
    this.janusReady$.pipe(
      filter(ready => ready),
      take(1)
    ).subscribe(() => this.janus = new Janus({
        success: () => this.attachPublisherPlugin(),
        error: error => Janus.error('Roomate session creating error', error),
        server,
        token
      }));
  }

  private async attachPublisherPlugin(): Promise<void> {
    // other room's members updating is a message for publisherHandle
    this.onUpdatePublishersSubscribe();
    this.onDeletePublisherSubscribe();
    const privateId = await this.publisherService.attachPlugin(
      this.janus.attach,
      this.roomId,
      this.initialUseAudio,
      this.initialUseVideo
    );
    this.subscribeService.attachPlugin(this.janus.attach, privateId, this.roomId);
  }

  private onUpdatePublishersSubscribe(): void {
    this.publisherService.updatePublishers$.pipe(
      untilDestroyed(this)
    ).subscribe(publishers => publishers
      .filter(publisher => this.myScreenPublishId === undefined || publisher.id !== this.myScreenPublishId)
      .forEach(publisher => this.subscribeService.onUpdatePublisher(publisher))
    );
  }

  private onDeletePublisherSubscribe(): void {
    this.publisherService.deletePublisher$.pipe(
      untilDestroyed(this)
    ).subscribe(id => this.subscribeService.onDeletePublisher(id));
  }
}
