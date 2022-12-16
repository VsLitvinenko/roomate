import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, filter, firstValueFrom, Observable, Subject, take } from 'rxjs';
import { Message } from './channels-api';
import { UsersService } from '../services';
import { promiseDelay } from '../../shared';

interface ChannelMessageEvent {
  channelId: number;
  message: Message;
}

@Injectable({
  providedIn: 'root'
})
export class SignalrApi {
  private readonly channelMessageEvents$ = new Subject<ChannelMessageEvent>();

  private readonly connected$ = new BehaviorSubject<boolean>(false);

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
    this.connect().then();
  }

  public get channelMessageEvents(): Observable<ChannelMessageEvent> {
    return this.channelMessageEvents$.asObservable();
  }

  private get connectionReady(): Promise<unknown> {
    return firstValueFrom(
      this.connected$.pipe(
        filter(value => value),
        take(1)
      )
    );
  }

  public async sendChannelMessage(params: {
    message: string;
    channelId: number;
  }): Promise<void> {
    await this.connectionReady;
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
          content: mes.content,
          isRead: true,
          attachments: []
        }
      })
    );
  }

  private async connect(): Promise<void> {
    try {
      await this.connection.start();
      this.connected$.next(true);
      console.log('CONNECTED');
    }
    catch (err) {
      await promiseDelay(5000);
      await this.connect();
    }
  }
}
