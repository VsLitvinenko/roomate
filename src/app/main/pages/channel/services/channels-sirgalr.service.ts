import { Injectable } from '@angular/core';
import { StoreChannelMessage, SignalrApi } from '../../../../core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TempMes {
  message: StoreChannelMessage;
  channelId: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChannelsSirgalrService {

  private readonly temporaryMessages$ = new BehaviorSubject<TempMes[]>([]);

  constructor(private readonly signalr: SignalrApi) { }

  public getTemporaryMessages(channelId: number): Observable<StoreChannelMessage[]> {
    return this.temporaryMessages$.pipe(
      map(
        temp => temp
          .filter(item => item.channelId === channelId)
          .map(item => item.message)
      )
    );
  }

  public async sendMessageToChannel(channelId: number, senderId: number, content: string): Promise<void> {
    // add temp message
    const tempMessage: StoreChannelMessage = {
      id: null,
      timestamp: (new Date()).toISOString(),
      // attachments: [],
      // isRead: true,
      content,
      senderId,
      channelId
    };
    this.temporaryMessages$.next([{
      message: tempMessage,
      channelId
    }, ...this.temporaryMessages$.value]);
    // send to signalr
    await this.sendChannelMessageToSignalr({
      message: content,
      channelId
    });
    // remove after it was sent (self message will be received as other ones)
    const temp = this.temporaryMessages$.value;
    const deleteIndex = temp.findIndex(item => item.message.content === content);
    temp.splice(deleteIndex, 1);
    this.temporaryMessages$.next(temp);
  }

  public async receiveChannelsMessages(handler: (TempMes) => void): Promise<void> {
    const connection = await this.signalr.connectionReady;
    connection.on(
      'ReceiveChannelMessage',
      (mes: any) => handler({
        channelId: mes.channelId,
        message: {
          id: mes.id,
          senderId: mes.senderId,
          timestamp: mes.timestamp,
          content: mes.content,
          isRead: true,
          attachments: []
        }
      })
    );
  }

  private async sendChannelMessageToSignalr(params: {
    message: string;
    channelId: number;
  }): Promise<void> {
    const connection = await this.signalr.connectionReady;
    return connection.invoke('SendChannelMessage', params);
  }
}
