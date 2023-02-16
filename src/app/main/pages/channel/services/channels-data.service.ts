import { Injectable } from '@angular/core';
import { filter, map, shareReplay, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  ChannelsStore,
  StoreChannel,
  StoreShortChannel,
  UsersService,
  Message,
  getChannel,
  getChannelsMessages,
  getShortChannels,
  SignalrApi
} from '../../../../core';
import {
  BehaviorSubject,
  combineLatest,
  firstValueFrom,
  from,
  Observable,
  switchMap
} from 'rxjs';

interface TempMes {
  message: Message;
  channelId: number;
}

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class ChannelsDataService {

  public readonly shortChannels$ = this.getShortsChannels();
  private readonly temporaryMessages$ = new BehaviorSubject<TempMes[]>([]);

  constructor(private readonly channelsStore: ChannelsStore,
              private readonly signalr: SignalrApi,
              private readonly users: UsersService) {
    this.receiveChannelsMessages();
  }

  public getChannelTitle(id: number): Observable<string> {
    return this.shortChannels$.pipe(
      map(shorts => shorts.find(channel => channel.id === id)?.title)
    );
  }

  public getChannelMessages(id: number): Observable<Message[]> {
    const storeMessages$ =  this.getChannel(id).pipe(
      tap(channel => this.users.updateListOfUsers(channel.members)),
      filter(channel => !!channel.messages.length),
      map(channel => channel.messages),
    );
    return combineLatest([
      storeMessages$,
      this.temporaryMessages$.pipe(
        map(temp => temp
          .filter(item => item.channelId === id)
          .map(item => item.message))
      )
    ]).pipe(
      map(([store, temp]) => [...temp, ...store]),
      shareReplay(1)
    );
  }

  public async sendMessageToChannel(id: number, content: string): Promise<void> {
    // add temp message
    const tempMessage: Message = {
      id: null,
      senderId: this.users.selfId,
      timestamp: (new Date()).toISOString(),
      attachments: [],
      isRead: true,
      content
    };
    this.temporaryMessages$.next([{
      channelId: id,
      message: tempMessage
    }, ...this.temporaryMessages$.value]);
    // send to signalr
    await this.signalr.sendChannelMessage({
      message: content,
      channelId: id
    });
    // remove after it was sent (self message will be received as other ones)
    const temp = this.temporaryMessages$.value;
    const deleteIndex = temp.findIndex(item => item.message.content === content);
    temp.splice(deleteIndex, 1);
    this.temporaryMessages$.next(temp);
  }

  public async loadChannelMessages(id: number): Promise<void> {
    const newMessages = firstValueFrom(
      getChannelsMessages(id, this.channelsStore.lastLoadedChatMessage(id))
    );
    await this.channelsStore.updateChatMessages(id, newMessages, 'end');
  }

  public getChannel(id: number): Observable<StoreChannel> {
    if (this.channelsStore.isChatFullyLoaded(id)) {
      return this.channelsStore.getChat(id);
    }
    return from(
      this.channelsStore.setChat(id, firstValueFrom(getChannel(id)))
    ).pipe(
      tap(() => this.loadChannelMessages(id)),
      switchMap(() => this.channelsStore.getChat(id))
    );
  }

  private getShortsChannels(): Observable<StoreShortChannel[]> {
    return getShortChannels().pipe(
      switchMap(shorts => from(this.channelsStore.setShorts(shorts))),
      switchMap(() => this.channelsStore.getShorts()),
      shareReplay(1)
    );
  }

  private receiveChannelsMessages(): void {
    this.signalr.channelMessageEvents.pipe(
      untilDestroyed(this)
    ).subscribe(event => this.channelsStore.updateChatMessages(
      event.channelId, [event.message], 'start'
    ));
  }
}
