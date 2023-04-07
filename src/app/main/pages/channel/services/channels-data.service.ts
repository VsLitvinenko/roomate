import { Injectable } from '@angular/core';
import { filter, map, shareReplay, tap } from 'rxjs/operators';
import {
  ChannelsStore,
  StoreChannel,
  UsersService,
  ChannelsApiClient,
  ChannelApiClient,
  StoreChannelMessage
} from '../../../../core';
import {
  combineLatest,
  firstValueFrom,
  from,
  Observable,
  switchMap
} from 'rxjs';
import { ChannelsSirgalrService, LastReadMesEvent, TempMes } from './channels-sirgalr.service';

export interface ChannelChatInfo {
  isTopMesLimitAchieved: boolean;
  isBottomMesLimitAchieved: boolean;
  lastReadMessageId: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChannelsDataService {

  public readonly shortChannels$ = this.channelsStore.getShorts().pipe(
    shareReplay(1)
  );

  constructor(private readonly channelsStore: ChannelsStore,
              private readonly users: UsersService,
              private readonly channelsApi: ChannelsApiClient,
              private readonly currentChannelApi: ChannelApiClient,
              private readonly channelsSignalr: ChannelsSirgalrService) {
    this.loadShortsChannels();
    this.receiveChannelsMessages();
    this.receiveLastReadMessageWasUpdated();
  }

  public getChannelTitle(id: number): Observable<string> {
    return this.shortChannels$.pipe(
      map(shorts => shorts.find(channel => channel.id === id)?.title)
    );
  }

  public getChannelChatInfo(id: number): Observable<ChannelChatInfo> {
    return this.getChannel(id).pipe(
      map(channel => ({
        isTopMesLimitAchieved: channel.isTopMesLimitAchieved,
        isBottomMesLimitAchieved: channel.isBottomMesLimitAchieved,
        lastReadMessageId: channel.lastReadMessageId
      }))
    );
  }

  public getChannelMessages(id: number): Observable<StoreChannelMessage[]> {
    return combineLatest([
      this.getChannel(id),
      this.channelsSignalr.getTemporaryMessages(id)
    ]).pipe(
      tap(([channel]) => this.users.updateListOfUsers(channel.members)),
      filter(([channel]) => channel.messages !== null),
      map(([channel, tempMes]) => tempMes.length ? [...tempMes, ...channel.messages] : channel.messages)
    );
  }

  public async sendMessageToChannel(id: number, content: string): Promise<void> {
    // add temp message
    await this.channelsSignalr.sendMessageToChannel(id, this.users.selfId, content);
  }

  public async updateLastReadMessage(channelId: number, messageId: number): Promise<void> {
    await this.channelsSignalr.updateLastReadMessage(channelId, messageId);
  }

  public async loadChannelMessages(
    channelId: number,
    side: 'top' | 'bottom' | 'initial',
    messageId?: number
  ): Promise<void> {
    let requestMessageId: number;
    let before: number;
    let after: number;
    if (side === 'initial') {
      requestMessageId = messageId ?? 0;
      before = 30;
      after = 30;
    }
    else {
      requestMessageId = this.channelsStore.borderLoadedChatMessageId(channelId, side);
      before = side === 'top' ? 40 : 0;
      after = side === 'bottom' ? 40: 0;
    }
    const mes = await this.loadChannelMessagesStore(channelId, requestMessageId, before, after);
    if (side === 'initial') {
      // init unread messages count
      const unreadMessages = requestMessageId === 0 ? mes.length : mes.findIndex(item => item.id === requestMessageId);
      this.channelsStore.increaseUnreadMessages(channelId, unreadMessages);
    }
  }

  public getChannel(id: number): Observable<StoreChannel> {
    if (this.channelsStore.isChatFullyLoaded(id)) {
      return this.channelsStore.getChat(id);
    }
    const getChannelRequest$: Observable<StoreChannel> = this.currentChannelApi.getChannelInfo(id).pipe(
      map(channel => ({
        ...channel,
        messages: null,
        unreadMessages: 0,
        isTopMesLimitAchieved: true,
        isBottomMesLimitAchieved: true,
        isFullyLoaded: true
      }))
    );
    return from(
      this.channelsStore.setChat(id, firstValueFrom(getChannelRequest$))
    ).pipe(
      tap(channel => this.loadChannelMessages(id, 'initial', channel.lastReadMessageId)),
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
      unreadMessages: 0,
      isTopMesLimitAchieved: true,
      isBottomMesLimitAchieved: true,
      isFullyLoaded: true
    });
    await this.channelsStore.updateChatMessages(newChannel.id, [], { position: 'start' });
  }

  private loadShortsChannels(): void {
    firstValueFrom(
      this.channelsApi.getChannelsShortInfo()
    ).then(shorts => this.channelsStore.setShorts(shorts));
  }

  private async loadChannelMessagesStore(
    channelId: number,
    mesId: number,
    before: number,
    after: number
  ): Promise<StoreChannelMessage[]> {
    // todo result messages count to compare with before / after
    const newMessages = (await firstValueFrom(
      this.currentChannelApi.getChannelMessages(channelId, mesId, before, after)
    ));
    let isTopMesLimitAchieved: boolean;
    let isBottomMesLimitAchieved: boolean;
    let position: 'start' | 'end';
    if (mesId === 0) {
      // first read messages in channel
      isTopMesLimitAchieved = true;
      isBottomMesLimitAchieved = newMessages.length < after;
      position = 'end';
    }
    else {
      // before + after + 1 current message (by mesId) as a request result
      const readIndex = newMessages.findIndex(item => item.id === mesId);
      isBottomMesLimitAchieved = after === 0 ? undefined : readIndex < after;
      isTopMesLimitAchieved = before === 0 ? undefined : newMessages.length - readIndex - 1 < before;
      position = before === 0 ? 'start' : 'end';
      if (before === 0 || after === 0) {
        // infinite scroll condition
        newMessages.splice(readIndex, 1);
      }
    }
    const options = {
      isBottomMesLimitAchieved,
      isTopMesLimitAchieved,
      position
    };
    return await this.channelsStore.updateChatMessages(channelId, newMessages, options) as StoreChannelMessage[];
  }

  private receiveChannelsMessages(): void {
    const handler = (temp: TempMes) => {
      this.channelsStore.increaseUnreadMessages(temp.channelId);
      this.channelsStore.updateChatMessages(
        temp.channelId, [temp.message], { position: 'start' }
      ).then();
    };
    this.channelsSignalr.receiveChannelsMessages(handler).then();
  }

  private receiveLastReadMessageWasUpdated(): void {
    const handler = (event: LastReadMesEvent) => this.channelsStore.updateLastReadMessage(
      event.channelId, event.messageId, event.unreadMessagesCount
    );
    this.channelsSignalr.receiveLastReadMessageWasUpdated(handler).then();
  }
}
