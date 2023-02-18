import { Injectable } from '@angular/core';
import { filter, map, shareReplay, tap } from 'rxjs/operators';
import {
  ChannelsStore,
  StoreChannel,
  StoreShortChannel,
  UsersService,
  ChannelsApiClient,
  ChannelApiClient,
  StoreChannelMessage,
} from '../../../../core';
import {
  combineLatest,
  firstValueFrom,
  from,
  Observable,
  switchMap
} from 'rxjs';
import { ChannelsSirgalrService, TempMes } from './channels-sirgalr.service';

export interface ChannelMessagesInfo {
  messages: StoreChannelMessage[];
  isLimitMessagesAchieved: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChannelsDataService {

  public readonly shortChannels$ = this.getShortsChannels();

  constructor(private readonly channelsStore: ChannelsStore,
              private readonly users: UsersService,
              private readonly channelsApi: ChannelsApiClient,
              private readonly currentChannelApi: ChannelApiClient,
              private readonly channelsSignalr: ChannelsSirgalrService) {
    this.receiveChannelsMessages();
  }

  public getChannelTitle(id: number): Observable<string> {
    return this.shortChannels$.pipe(
      map(shorts => shorts.find(channel => channel.id === id)?.title)
    );
  }

  public getChannelMessagesInfo(id: number): Observable<ChannelMessagesInfo> {
    return combineLatest([
      this.getChannel(id),
      this.channelsSignalr.getTemporaryMessages(id)
    ]).pipe(
      filter(([channel]) => !!channel.messages.length),
      map(([channel, tempMes]) => ({
        messages: [...tempMes, ...channel.messages],
        isLimitMessagesAchieved: channel.isLimitMessagesAchieved
      }))
    );
  }

  public async sendMessageToChannel(id: number, content: string): Promise<void> {
    // add temp message
    await this.channelsSignalr.sendMessageToChannel(id, this.users.selfId, content);
  }

  public async loadChannelMessages(channelId: number): Promise<void> {
    const newMessages = await firstValueFrom(
      this.currentChannelApi.getChannelMessages(
        channelId,
        this.channelsStore.lastLoadedChatMessageId(channelId),
        50,
        0
      )
    );
    await this.channelsStore.updateChatMessages(channelId, newMessages, 'end');
  }

  public getChannel(id: number): Observable<StoreChannel> {
    if (this.channelsStore.isChatFullyLoaded(id)) {
      return this.channelsStore.getChat(id);
    }
    const getChannelRequest$: Observable<StoreChannel> = this.currentChannelApi.getChannelInfo(id).pipe(
      map(channel => ({
        ...channel,
        messages: [],
        isLimitMessagesAchieved: false
      }))
    );
    return from(
      this.channelsStore.setChat(id, firstValueFrom(getChannelRequest$))
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
    await this.channelsStore.setChat(newChannel.id, {
      ...newChannel,
      messages: [],
      isLimitMessagesAchieved: false
    });
  }

  private getShortsChannels(): Observable<StoreShortChannel[]> {
    return this.channelsApi.getChannelsShortInfo().pipe(
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
