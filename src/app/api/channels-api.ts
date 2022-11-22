import { Observable, of } from 'rxjs';
import { channels, shortChannels, testGroupMessages } from './data-source';
import { delay } from 'rxjs/operators';

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

export const getShortChannels = (): Observable<ShortChannel[]> => {
  console.warn('GET SHORT CHANNELS REQUEST');
  return of(shortChannels).pipe(
    delay(1000)
  );
};

export const getChannel = (id: number): Observable<Channel> => {
  console.warn('GET CHANNEL REQUEST', id);
  return of(channels.find(item => item.id === id)).pipe(
    delay(1000)
  );
};

export const getChannelsMessages = (
  id: number,
  startIndex: number
): Observable<Message[]> => {
  console.warn('GET CHANNELS MESSAGE', id, startIndex);
  const time = Date.now() - startIndex * 100000;
  return of(
    testGroupMessages.map((item, index) => ({
      ...item,
      id: startIndex + index,
      timestamp: (new Date(time - index * 100000)).toISOString()
    }))
  ).pipe(
    delay(1000),
  );
};
