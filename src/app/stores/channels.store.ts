import { Injectable } from '@angular/core';
import { Channel, ShortChannel } from '../api/channels-api';
import { FullChat, ShortChat, Store } from './store';

export interface StoreChannel extends Channel, FullChat { }
export interface StoreShortChannel extends ShortChannel, ShortChat { }

@Injectable({
  providedIn: 'root'
})
export class ChannelsStore extends Store<StoreChannel, StoreShortChannel>{

  constructor() {
    const fullToShort: (x: StoreChannel) => StoreShortChannel =
      channel => ({
        id: channel.id,
        title: channel.title,
        private: channel.private,
        unreadMessagesCount: channel.unreadMessagesCount
      });
    const shortToFull: (x: StoreShortChannel) => StoreChannel =
      short => ({
        id: short.id,
        title: short.title,
        private: short.private,
        unreadMessagesCount: short.unreadMessagesCount,
        videorooms: [],
        messages: [],
        members: [],
        isFullyLoaded: false
      });

    super(fullToShort, shortToFull);
  }

}
