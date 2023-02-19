import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, filter, firstValueFrom, take } from 'rxjs';
import { UsersService } from '../services';
import { promiseDelay } from '../../shared';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalrApi {

  private readonly connected$ = new BehaviorSubject<boolean>(false);

  private readonly connection = new signalR.HubConnectionBuilder()
    .withUrl(`${environment.signalR}/hub`,
      {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
        accessTokenFactory: () => this.users.accessToken
      })
    .withAutomaticReconnect()
    .build();

  constructor(private readonly users: UsersService) {
    this.connect().then();
  }

  public get connectionReady(): Promise<signalR.HubConnection> {
    return firstValueFrom(
      this.connected$.pipe(
        filter(value => value),
        take(1)
      )
    ).then(() => this.connection);
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
