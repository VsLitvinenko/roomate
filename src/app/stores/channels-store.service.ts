import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Channel, Message, ShortChannel } from '../api/channels-api';

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
    return combineLatest([...this.channels.values()]).pipe(
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

  public async setShortChannels(
    shortChannels: ShortChannel[] | Promise<ShortChannel[]>
  ): Promise<void> {
    (await shortChannels)
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

  public getChannel(id: number): Observable<StoreChannel> {
    return this.channels.get(id).pipe(
      filter(channel => channel.hasOwnProperty('id')),
      filter(channel => channel.isFullyLoaded)
    );
  }

  public isChannelFullyLoad(id: number): boolean {
    return this.channels.has(id) && this.channels.get(id).value.isFullyLoaded;
  }

  public lastChannelMessage(id: number): number {
    return this.channels.get(id).value.messages.length;
  }

  public async setChannel(
    id: number,
    newChannel: Channel | Promise<Channel>
  ): Promise<void> {
    let channel$: BehaviorSubject<StoreChannel>;
    if (this.channels.has(id)) {
      // fully load short channel or update existing channel
      channel$ = this.channels.get(id);
      channel$.value.isFullyLoaded = true;
    }
    else {
      const pseudoLoad = { isFullyLoaded: true } as StoreChannel;
      channel$ = this.channels.get(id) ?? new BehaviorSubject<StoreChannel>(pseudoLoad);
      this.channels.set(id, channel$);
    }
    channel$.next({
      ...(await newChannel),
      isFullyLoaded: true,
      unreadMessagesCount: channel$.value?.unreadMessagesCount ?? 0,
      messages: channel$.value?.messages ?? []
    });
  }

  public async updateChannelMessages(
    id: number,
    newMessages: Message[] | Promise<Message[]>,
    position: 'start' | 'end'
  ): Promise<void> {
    const channel$ = this.channels.get(id);
    let messages: Message[];
    switch (position) {
      case 'start':
        messages = [...(await newMessages), ...channel$.value.messages];
        break;
      case 'end':
        messages = [...channel$.value.messages, ...(await newMessages)];
        break;
    }
    channel$.next({
      ...channel$.value,
      messages
    });
  }
}
