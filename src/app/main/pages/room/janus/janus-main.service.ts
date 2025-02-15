import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, switchMap } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { Janus } from './janus.constants';
import { JanusJS } from './janus.types';
import { JanusSubscribeService, JanusShareScreenService, JanusPublisherService } from './services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { environment } from '../../../../../environments/environment';
import { UsersService } from '../../../../core';

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
    private readonly screenService: JanusShareScreenService,
    private readonly users: UsersService
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

  public get remoteTracks$(): Observable<{[p: number]: JanusJS.PublisherTracks}> {
    return this.subscribeService.remoteTracks$$.pipe(
      switchMap(res => this.users.getUsersList(Object.keys(res).map(id => Number(id))).pipe(
        map(users => {
          users.forEach(user => {
            res[user.id].display = user.fullName;
            res[user.id].img = user.imageUrl;
          });
          return res;
        })
      ))
    );
  }

  public get localTracks$(): Observable<JanusJS.PublisherTracks[]> {
    const localMain$: Observable<JanusJS.PublisherTracks> = combineLatest([
      this.publisherService.localPublisher$$,
      this.users.selfUser$
    ]).pipe(
      map(([publisher, selfUser]) => ({
        ...publisher,
        img: selfUser.imageUrl
      }))
    );
    return combineLatest([
      localMain$,
      this.screenService.localScreenPublisher$$
    ]).pipe(
      map(tracks => tracks.filter(item => item !== null))
    );
  }

  public async leaveRoom(): Promise<void> {
    if (!this.janus.isConnected()) {
      return;
    }
    await this.subscribeService.detachPlugin();
    await this.publisherService.detachPlugin();
    await this.screenService.detachPlugin();
    return new Promise((resolve, reject) => {
      this.janus.destroy({
        cleanupHandles: true,
        notifyDestroyed: true,
        success: () => resolve(),
        error: err => reject(err)
      });
    });
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
      this.initialUseVideo,
      this.users.selfId
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
