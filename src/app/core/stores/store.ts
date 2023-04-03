import { BehaviorSubject, combineLatest, Observable, of, switchMap } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ChatMessage, FullChat, ShortChat } from './interfaces';
import { HotMap } from 'src/app/shared';

export abstract class Store<Full extends FullChat, Short extends ShortChat> {

  private readonly fullToShort: (x: Full) => Short;
  private readonly shortToFull: (x: Short) => Full;

  private readonly store = new HotMap<number, BehaviorSubject<Full>>();

  protected constructor(
    fullToShort: (x: Full) => Short,
    shortToFull: (x: Short) => Full
  ) {
    this.fullToShort = fullToShort;
    this.shortToFull = shortToFull;
  }

  public getShorts(): Observable<Short[]> {
    return this.store.valuesUpdated.pipe(
      switchMap(values => this.store.size ? combineLatest([...values]) : of([])),
      map(res => res.map(full => this.fullToShort(full)))
    );
  }

  public async setShorts(shorts: Promise<Short[]> | Short[]): Promise<void> {
    const value: ([ number, BehaviorSubject<Full> ])[] =
      (await shorts)
        .filter(short => !this.store.has(short.id))
        .map(short => this.shortToFull(short))
        .map(full => [full.id, new BehaviorSubject<Full>(full)]);
    this.store.setMany(value);
  }

  public getChat(id: number): Observable<Full> {
    return this.store.get(id).pipe(
      filter(full => full.hasOwnProperty('id')),
      filter(full => full.isFullyLoaded)
    );
  }

  public isChatFullyLoaded(id: number): boolean {
    return this.store.has(id) && this.store.get(id).value.isFullyLoaded;
  }

  public borderLoadedChatMessageId(id: number, side: 'top' | 'bottom'): number {
    const channel = this.store.get(id).value;
    if (channel.messages?.length) {
      return side === 'top' ? channel.messages.at(-1).id : channel.messages.at(0).id;
    } else {
      return 0;
    }
  }

  public async setChat(id: number, newChat: Full | Promise<Full>): Promise<Full> {
    let chat$: BehaviorSubject<Full>;
    if (this.store.has(id)) {
      // fully load short chat or update existing chat
      chat$ = this.store.get(id);
      chat$.value.isFullyLoaded = true;
    }
    else {
      const pseudoLoad = {
        messages: null,
        isFullyLoaded: true,
      } as Full;
      chat$ = new BehaviorSubject<Full>(pseudoLoad);
      this.store.set(id, chat$);
    }
    try {
      chat$.next({
        ...(await newChat),
        isFullyLoaded: true,
        // IGNORE MESSAGES ARRAY
        unreadMessages: chat$.value.unreadMessages,
        messages: chat$.value.messages
      });
      return newChat;
    }
    catch (e) {
      chat$.value.isFullyLoaded = false;
    }
  }

  public async updateChatMessages(
    id: number,
    newMessages: ChatMessage[] | Promise<ChatMessage[]>,
    options: {
      position: 'start' | 'end';
      isTopMesLimitAchieved?: boolean;
      isBottomMesLimitAchieved?: boolean;
    }
  ): Promise<void> {
    const chat$ = this.store.get(id);
    const existMessages = chat$.value.messages ?? [];
    let messages: ChatMessage[];
    switch (options.position) {
      case 'start':
        messages = [...(await newMessages), ...existMessages];
        break;
      case 'end':
        messages = [...existMessages, ...(await newMessages)];
        break;
    }
    chat$.next({
      ...chat$.value,
      messages,
      isTopMesLimitAchieved: options.isTopMesLimitAchieved ?? chat$.value.isTopMesLimitAchieved,
      isBottomMesLimitAchieved: options.isBottomMesLimitAchieved ?? chat$.value.isBottomMesLimitAchieved
    });
  }

  public updateLastReadMessage(chatId: number, lastReadMessageId: number, unreadMessages: number): void {
    const chat$ = this.store.get(chatId);
    chat$.next({
      ...chat$.value,
      lastReadMessageId,
      unreadMessages
    });
  }
}
