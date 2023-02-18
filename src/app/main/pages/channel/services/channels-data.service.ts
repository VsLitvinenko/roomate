import { Injectable } from '@angular/core';
import { filter, map, shareReplay, tap } from 'rxjs/operators';
import {
  ChannelsStore,
  StoreChannel,
  StoreShortChannel,
  UsersService,
  Message,
  getChannel,
  getChannelsMessages,
  getShortChannels,
  ChannelsApiClient,
} from '../../../../core';
import {
  combineLatest,
  firstValueFrom,
  from,
  Observable,
  switchMap
} from 'rxjs';
import { ChannelsSirgalrService, TempMes } from './channels-sirgalr.service';

@Injectable({
  providedIn: 'root'
})
export class ChannelsDataService {

  public readonly shortChannels$ = this.getShortsChannels();

  constructor(private readonly channelsStore: ChannelsStore,
              private readonly users: UsersService,
              private readonly channelsApi: ChannelsApiClient,
              private readonly channelsSignalr: ChannelsSirgalrService) {
    this.receiveChannelsMessages();
  }

  public getChannelTitle(id: number): Observable<string> {
    return this.shortChannels$.pipe(
      map(shorts => shorts.find(channel => channel.id === id)?.title)
    );
  }

  public getChannelMessages(id: number): Observable<Message[]> {
    const storeMessages$ =  this.getChannel(id).pipe(
      tap(channel => this.users.updateListOfUsers(channel.members)),
      filter(channel => !!channel.messages.length),
      map(channel => channel.messages),
    );
    return combineLatest([
      storeMessages$,
      this.channelsSignalr.getTemporaryMessages(id)
    ]).pipe(
      map(([store, temp]) => [...temp, ...store]),
      shareReplay(1)
    );
  }

  public async sendMessageToChannel(id: number, content: string): Promise<void> {
    // add temp message
    await this.channelsSignalr.sendMessageToChannel(id, this.users.selfId, content);
  }

  public async loadChannelMessages(id: number): Promise<void> {
    const newMessages = firstValueFrom(
      getChannelsMessages(id, this.channelsStore.lastLoadedChatMessage(id))
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

  public async createChannel(title: string, isPrivate: boolean, members: number[]): Promise<void> {
    const newChannel = await firstValueFrom(
      this.channelsApi.createChannel({
        title,
        members,
        private: isPrivate
      })
    );
    await this.channelsStore.setChat(newChannel.id, newChannel);
  }

  private getShortsChannels(): Observable<StoreShortChannel[]> {
    return getShortChannels().pipe(
      switchMap(shorts => from(this.channelsStore.setShorts(shorts))),
      switchMap(() => this.channelsStore.getShorts()),
      shareReplay(1)
    );
  }

  private receiveChannelsMessages(): void {
    const handler = (temp: TempMes) => this.channelsStore.updateChatMessages(
      temp.channelId, [temp.message], 'start'
    );
    this.channelsSignalr.receiveChannelsMessages(handler).then();
  }
}
