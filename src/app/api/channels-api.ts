import { Observable, of } from 'rxjs';
import { channels, shortChannels, testGroupMessages } from './data-source';
import { debounceTime } from 'rxjs/operators';

export interface ShortChannel {
  id: number;
  title: string;
  private: boolean;
  unreadMessagesCount: number;
}

export interface Channel {
  id: number;
  title: string;
  private: boolean;
  videorooms: any[];
  members: number[];
}

export interface Message {
  id: number;
  senderId: number;
  content: string;
  timestamp: string;
  attachments: any[];
  isRead: boolean;
}

export const getShortChannels = (): Observable<ShortChannel[]> =>
  of(shortChannels).pipe(
    debounceTime(1000)
  );

export const getChannel = (id: number): Observable<Channel> =>
  of(channels.find(item => item.id === id)).pipe(
    debounceTime(1000)
  );

export const getChannelsMessages = (
  id: number,
  startIndex: number
): Observable<Message[]> => {
  const time = Date.now() - startIndex * 100000;
  return of(
    testGroupMessages.map((item, index) => ({
      ...item,
      id: startIndex + index,
      timestamp: (new Date(time - index * 100000)).toISOString()
    }))
  ).pipe(
    debounceTime(1000),
  );
};
