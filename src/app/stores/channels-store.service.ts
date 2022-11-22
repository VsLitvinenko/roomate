import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import {
  Channel,
  getChannel,
  getChannelsMessages,
  getShortChannels,
  Message,
  ShortChannel
} from '../api/channels-api';

export interface FullChannel extends Channel {
  messages: Message[];
  isFullyLoaded: boolean;
  unreadMessagesCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChannelsStoreService {

  private readonly channels$ = new BehaviorSubject<{ [id: number]: FullChannel }>({});
  private shortChannelsInitialized = false;

  constructor() {
  }

  public getShortChannels(): Observable<ShortChannel[]> {
    if (!this.shortChannelsInitialized) {
      this.loadShortChannels().then(
        () => this.shortChannelsInitialized = true
      );
    }
    return this.channels$.pipe(
      map(
        value => Object.values(value).map(channel => ({
          id: channel.id,
          title: channel.title,
          private: channel.private,
          unreadMessagesCount: channel.unreadMessagesCount,
        }))
      ),
    );
  }

  public getChannel(id: number): Observable<FullChannel> {
    if (!this.channels$.value[id]?.isFullyLoaded) {
      this.loadChannel(id).then(
        () => this.loadChannelMessages(id)
      );
    }
    return this.channels$.pipe(
      map(value => value[id]),
      filter(channel => !!channel)
    );
  }

  public async loadChannelMessages(id: number): Promise<void> {
    const channels = this.channels$.value;
    const currentChannel = channels[id];
    const newMsgs = await getChannelsMessages(id, currentChannel.messages.length).pipe(
      take(1)
    ).toPromise();
    this.channels$.next({
      ...channels,
      [id]: {
        ...currentChannel,
        messages: [...currentChannel.messages, ...newMsgs]
      }
    });
  }

  private async loadShortChannels(): Promise<void> {
    const shortChannels = await getShortChannels().pipe(
      take(1)
    ).toPromise();
    const store = this.channels$.value;
    const channels = shortChannels
      .filter(item => !store[item.id])
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
