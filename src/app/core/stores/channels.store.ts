import { Injectable } from '@angular/core';
import { FullChat, ShortChat, Store } from './store';
import { ChannelInfo, ChannelShortInfo } from '../api-generated/api-client';

export interface StoreChannel extends ChannelInfo, FullChat { }
export interface StoreShortChannel extends ChannelShortInfo, ShortChat { }

@Injectable({
  providedIn: 'root'
})
export class ChannelsStore extends Store<StoreChannel, StoreShortChannel> {

  constructor() {
    const fullToShort: (x: StoreChannel) => StoreShortChannel =
      channel => ({
        id: channel.id,
        title: channel.title,
        private: channel.private,
        unreadMessages: channel.unreadMessagesCount
      });
    const shortToFull: (x: StoreShortChannel) => StoreChannel =
      short => ({
        id: short.id,
        title: short.title,
        private: short.private,
        unreadMessagesCount: short.unreadMessages,
        videorooms: [],
        messages: [],
        members: [],
        isFullyLoaded: false
      });

    super(fullToShort, shortToFull);
  }

}
