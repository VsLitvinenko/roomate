import { Injectable } from '@angular/core';
import { ChannelsStoreService, FullChannel } from '../../../stores/channels-store.service';
import { UsersStoreService } from '../../../stores/users-store.service';
import { Observable } from 'rxjs';
import { Message } from '../../../api/channels-api';
import { filter, map, shareReplay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChannelsSelectService {
  public shortChannels$ = this.channelsStore.getShortChannels().pipe(
    shareReplay(1)
  );

  constructor(private readonly channelsStore: ChannelsStoreService,
              private readonly usersStore: UsersStoreService) {
  }

  public getChannelTitle(id: number): Observable<string> {
    return this.getChannel(id).pipe(
      map(channel => channel.title)
    );
  }

  public getChannelMessages(id: number): Observable<Message[]> {
    return this.getChannel(id).pipe(
      map(channel => channel.messages),
      filter(messages => !!messages.length)
    );
  }

  public loadChannelMessages(id: number): Promise<void> {
    return this.channelsStore.loadChannelMessages(id);
  }

  private getChannel(id: number): Observable<FullChannel> {
    return this.channelsStore.getChannel(id).pipe(
      tap(channel => this.usersStore.storeListOfUsers(channel.members))
    );
  }
}
