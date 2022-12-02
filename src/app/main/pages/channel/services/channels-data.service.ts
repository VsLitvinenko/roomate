import { Injectable } from '@angular/core';
import { filter, map, shareReplay, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  ChannelsStore,
  StoreChannel,
  StoreShortChannel,
  UsersService,
  Message,
  getChannel,
  getChannelsMessages,
  getShortChannels,
  SignalrApi
} from '../../../../core';
import {
  BehaviorSubject,
  combineLatest,
  firstValueFrom,
  from,
  Observable,
  switchMap
} from 'rxjs';

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class ChannelsDataService {

  public readonly shortChannels$ = this.getShortsChannels();
  private readonly temporaryMessages$ = new BehaviorSubject<Message[]>([]);

  constructor(private readonly channelsStore: ChannelsStore,
              private readonly signalr: SignalrApi,
              private readonly users: UsersService) {
    this.receiveChannelsMessages();
  }

  public getChannelTitle(id: number): Observable<string> {
    return this.shortChannels$.pipe(
      map(shorts => shorts.find(channel => channel.id === id)?.title)
    );
  }

  public getChannelMessages(id: number): Observable<Message[]> {
    const storeMessages$ =  this.getChannel(id).pipe(
      filter(channel => !!channel.messages.length),
      tap(channel => this.users.updateListOfUsers(channel.members)),
      map(channel => channel.messages),
    );
    return combineLatest([
      storeMessages$,
      this.temporaryMessages$
    ]).pipe(
      map(([store, temp]) => [...temp, ...store]),
      shareReplay(1)
    );
  }

  public async sendMessageToChannel(id: number, message: Message): Promise<void> {
    message.senderId = this.users.selfId;
    // add temp message
    this.temporaryMessages$.next([
      message, ...this.temporaryMessages$.value
    ]);
    // send to signalr
    await this.signalr.sendChannelMessage({
      message: message.content,
      channelId: id
    });
    // remove after it was sent (self message will be received as other ones)
    const temp = this.temporaryMessages$.value;
    temp.splice(temp.findIndex(item => item.content === message.content), 1);
    this.temporaryMessages$.next(temp);
  }

  public async loadChannelMessages(id: number): Promise<void> {
    const newMessages = firstValueFrom(
      getChannelsMessages(id, this.channelsStore.lastChatMessage(id))
    );
    await this.channelsStore.updateChatMessages(id, newMessages, 'end');
  }

  public getChannel(id: number): Observable<StoreChannel> {
    if (this.channelsStore.isChatFullyLoaded(id)) {
      return this.channelsStore.getChat(id);
    }
    return from(
      this.channelsStore.setChat(id, firstValueFrom(getChannel(id)))
    ).pipe(
      tap(() => this.loadChannelMessages(id)),
      switchMap(() => this.channelsStore.getChat(id))
    );
  }

  private getShortsChannels(): Observable<StoreShortChannel[]> {
    return getShortChannels().pipe(
      switchMap(shorts => from(this.channelsStore.setShorts(shorts))),
      switchMap(() => this.channelsStore.getShorts()),
      shareReplay(1)
    );
  }

  private receiveChannelsMessages(): void {
    this.signalr.channelMessageEvents.pipe(
      untilDestroyed(this)
    ).subscribe(event => this.channelsStore.updateChatMessages(
      event.channelId, [event.message], 'start'
    ));
  }
}
