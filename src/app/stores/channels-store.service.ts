import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, from, Observable } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import {
  Channel,
  getChannel,
  getChannelsMessages,
  getShortChannels,
  Message,
  ShortChannel
} from '../api/channels-api';

export interface StoreChannel extends Channel {
  messages: Message[];
  isFullyLoaded: boolean;
  unreadMessagesCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChannelsStoreService {
  private readonly channels = new Map<number, BehaviorSubject<StoreChannel>>();

  constructor() { }

  public getShortChannels(): Observable<ShortChannel[]> {
    // this method should be called just ones
    return from(
      this.loadShortChannels()
    ).pipe(
      switchMap(() => combineLatest([...this.channels.values()])),
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

  public getChannel(id: number): Observable<StoreChannel> {
    if (
      !this.channels.has(id) ||
      !this.channels.get(id).value.isFullyLoaded
    ) {
      const pseudoLoad = { isFullyLoaded: true } as StoreChannel;
      this.channels.set(id, new BehaviorSubject<StoreChannel>(pseudoLoad));
      this.loadChannel(id).then(
        () => this.loadChannelMessages(id)
      );
    }
    return this.channels.get(id).pipe(
      filter(channel => channel.hasOwnProperty('id')),
      filter(channel => channel.isFullyLoaded)
    );
  }

  public async loadChannelMessages(id: number): Promise<void> {
    const channel$ = this.channels.get(id);
    const newMsgs = await getChannelsMessages(id, channel$.value.messages.length).pipe(
      take(1)
    ).toPromise();
    channel$.next({
      ...channel$.value,
      messages: [...channel$.value.messages, ...newMsgs]
    });
  }

  private async loadShortChannels(): Promise<void> {
    const shortChannels = await getShortChannels().pipe(
      take(1)
    ).toPromise();
    shortChannels
      .filter(channel => !this.channels.has(channel.id))
      .forEach(channel => {
        const res = {
          id: channel.id,
          title: channel.title,
          private: channel.private,
          unreadMessagesCount: channel.unreadMessagesCount,
          videorooms: [],
          messages: [],
          members: [],
          isFullyLoaded: false
        };
        this.channels.set(channel.id, new BehaviorSubject<StoreChannel>(res));
      });
  }

  private async loadChannel(id: number): Promise<void> {
    const newChannel = await getChannel(id).pipe(
      take(1)
    ).toPromise();
    const channel$ = this.channels.get(id);
    channel$.next({
      ...newChannel,
      isFullyLoaded: true,
      unreadMessagesCount: channel$.value?.unreadMessagesCount,
      messages: channel$.value?.messages ?? []
    });
  }
}
