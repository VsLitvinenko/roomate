import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import {
  Channel,
  getChannel,
  getChannelsMessages,
  getShortChannels,
  Message,
  ShortChannel
} from '../api/channels-api';
import isEmpty from 'lodash-es/isEmpty';

interface FullChannel extends Channel {
  messages: Message[];
  isFullyLoaded: boolean;
  unreadMessagesCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChannelsStoreService {

  private readonly channels$ = new BehaviorSubject<{ [id: number]: FullChannel }>({});

  constructor() {
  }

  public getShortChannels(): Observable<ShortChannel[]> {
    return this.channels$.pipe(
      tap(async value => {
        if (isEmpty(value)) {
          await this.loadShortChannels();
        }
      }),
      map(
        value => Object.values(value).map(channel => ({
          id: channel.id,
          title: channel.title,
          private: channel.private,
          unreadMessagesCount: channel.unreadMessagesCount,
        }))
      )
    );
  }

  public getChannel(id: number): Observable<FullChannel> {
    return this.channels$.pipe(
      map(value => value[id]),
      tap(async channel => {
        if (!channel?.isFullyLoaded) {
          await this.loadChannel(id);
          await this.loadChannelMessages(id, channel.messages.length);
        }
      }),
      filter(channel => !!channel)
    );
  }

  public async loadChannelMessages(id: number, startIndex: number): Promise<void> {
    const newMsgs = await getChannelsMessages(id, startIndex).pipe(
      take(1)
    ).toPromise();
    const channels = this.channels$.value;
    this.channels$.next({
      ...channels,
      [id]: {
        ...channels[id],
        messages: [...channels[id].messages, ...newMsgs]
      }
    });
  }

  private async loadShortChannels(): Promise<void> {
    const shortChannels = await getShortChannels().pipe(
      take(1)
    ).toPromise();
    const store = this.channels$.value;
    const channels = shortChannels
      .filter(item => store[item.id])
      .reduce((res: { [id: number]: FullChannel }, item) => {
        res[item.id] = {
          id: item.id,
          title: item.title,
          private: item.private,
          unreadMessagesCount: item.unreadMessagesCount,
          videorooms: [],
          messages: [],
          members: [],
          isFullyLoaded: false
        };
        return res;
      }, {});
    this.channels$.next(channels);
  }

  private async loadChannel(id: number): Promise<void> {
    const newChannel = await getChannel(id).pipe(
      take(1)
    ).toPromise();
    const channels = this.channels$.value;
    this.channels$.next({
      ...channels,
      [id]: {
        ...newChannel,
        isFullyLoaded: true,
        unreadMessagesCount: channels[id]?.unreadMessagesCount,
        messages: channels[id]?.messages ?? []
      }
    });
  }
}
