import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { Message } from './channels-api';
import { UsersService } from '../services';

interface ChannelMessageEvent {
  channelId: number;
  message: Message;
}

@Injectable({
  providedIn: 'root'
})
export class SignalrApi {
  private readonly channelMessageEvents$ = new Subject<ChannelMessageEvent>();

  private readonly connection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:8100/hub',
      {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
        accessTokenFactory: () => this.users.accessToken
      })
    .withAutomaticReconnect()
    .build();

  constructor(private readonly users: UsersService) {
    this.receiveChannelsMessages();
    this.connect();
  }

  public get channelMessageEvents(): Observable<ChannelMessageEvent> {
    return this.channelMessageEvents$.asObservable();
  }

  public async sendChannelMessage(params: {
    message: string;
    channelId: number;
  }): Promise<void> {
    await this.connection.invoke('SendChannelMessage', params);
  }

  private receiveChannelsMessages(): void {
    this.connection.on(
      'ReceiveChannelMessage',
      (mes: any) => this.channelMessageEvents$.next({
        channelId: mes.channelId,
        message: {
          id: mes.id,
          senderId: mes.senderId,
          timestamp: mes.timestamp,
          content: mes.message,
          isRead: true,
          attachments: []
        }
      })
    );
  }

  private connect(): void {
    this.connection.start().then(
      answer => console.log(answer, 'CONNECTED'),
      err => console.error(err, 'NO CONNECTION')
    );
  }
}
