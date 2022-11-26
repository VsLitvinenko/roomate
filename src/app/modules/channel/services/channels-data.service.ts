import { Injectable } from '@angular/core';
import { ChannelsStoreService, StoreChannel } from '../../../stores/channels-store.service';
import { UsersStoreService } from '../../../stores/users-store.service';
import { firstValueFrom, from, Observable, switchMap } from 'rxjs';
import {
  getChannel,
  getChannelsMessages,
  getShortChannels,
  Message,
  ShortChannel
} from '../../../api/channels-api';
import { filter, map, shareReplay, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ChannelsDataService {

  public readonly shortChannels$ = this.getShortsChannels();

  constructor(private readonly channelsStore: ChannelsStoreService,
              private readonly usersStore: UsersStoreService) {
  }

  public getChannelTitle(id: number): Observable<string> {
    return this.shortChannels$.pipe(
      map(shorts => shorts.find(channel => channel.id === id)?.title)
    );
  }

  public getChannelMessages(id: number): Observable<Message[]> {
    return this.getChannel(id).pipe(
      tap(channel => this.usersStore.updateListOfUsers(channel.members)),
      map(channel => channel.messages),
      filter(messages => !!messages.length)
    );
  }

  public async loadChannelMessages(id: number): Promise<void> {
    const newMessages = firstValueFrom(
      getChannelsMessages(id, this.channelsStore.lastChannelMessage(id))
    );
    await this.channelsStore.updateChannelMessages(id, newMessages, 'end');
  }

  private getChannel(id: number): Observable<StoreChannel> {
    if (this.channelsStore.isChannelFullyLoad(id)) {
      return this.channelsStore.getChannel(id);
    }
    return from(
      this.channelsStore.setChannel(id, firstValueFrom(getChannel(id)))
    ).pipe(
      tap(() => this.loadChannelMessages(id)),
      switchMap(() => this.channelsStore.getChannel(id))
    );
  }

  private getShortsChannels(): Observable<ShortChannel[]> {
    return getShortChannels().pipe(
      switchMap(shorts => from(this.channelsStore.setShortChannels(shorts))),
      switchMap(() => this.channelsStore.getShortChannels()),
      shareReplay(1)
    );
  }
}
