import { Injectable } from '@angular/core';
import { ChannelsStore, StoreChannel, StoreShortChannel } from '../../../../../stores/channels.store';
import { UsersService } from '../../../../shared/services/users.service';
import { firstValueFrom, from, Observable, switchMap } from 'rxjs';
import { getChannel, getChannelsMessages, getShortChannels, Message } from '../../../../../api/channels-api';
import { filter, map, shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChannelsDataService {

  public readonly shortChannels$ = this.getShortsChannels();

  constructor(private readonly channelsStore: ChannelsStore,
              private readonly users: UsersService) {
  }

  public getChannelTitle(id: number): Observable<string> {
    return this.shortChannels$.pipe(
      map(shorts => shorts.find(channel => channel.id === id)?.title)
    );
  }

  public getChannelMessages(id: number): Observable<Message[]> {
    return this.getChannel(id).pipe(
      filter(channel => !!channel.messages.length),
      tap(channel => this.users.updateListOfUsers(channel.members)),
      map(channel => channel.messages),
    );
  }

  public async sendMessageToChannel(id: number, message: Message): Promise<void> {
    message.senderId = this.users.selfId;
    await this.channelsStore.updateChatMessages(id, [message], 'start');
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
}
