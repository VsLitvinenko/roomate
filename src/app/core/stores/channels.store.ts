import { Injectable } from '@angular/core';
import { ChannelInfo, ChannelMessage, ChannelShortInfo } from '../api';
import { ChatMessage, FullChat, ShortChat } from './interfaces';
import { Store } from './store';

export interface StoreChannelMessage extends ChannelMessage, ChatMessage { }

export interface StoreChannel extends ChannelInfo, FullChat {
  messages: StoreChannelMessage[];
}
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
        unreadMessages: channel.unreadMessages
      });
    const shortToFull: (x: StoreShortChannel) => StoreChannel =
      short => ({
        id: short.id,
        title: short.title,
        private: short.private,
        unreadMessages: short.unreadMessages,
        videorooms: [],
        creatorId: null,
        createdAt: null,
        messages: null,
        members: [],
        isFullyLoaded: false,
        isTopMesLimitAchieved: true,
        isBottomMesLimitAchieved: true,
        lastReadMessageId: null,
      });

    super(fullToShort, shortToFull);
  }

}
