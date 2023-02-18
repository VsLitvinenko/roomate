import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { cloneDeep } from 'lodash-es';
import { ChatMessage, FullChat, ShortChat } from './interfaces';

export abstract class Store<Full extends FullChat, Short extends ShortChat> {

  private readonly fullToShort: (x: Full) => Short;
  private readonly shortToFull: (x: Short) => Full;

  private readonly store = new Map<number, BehaviorSubject<Full>>();

  protected constructor(
    fullToShort: (x: Full) => Short,
    shortToFull: (x: Short) => Full
  ) {
    this.fullToShort = fullToShort;
    this.shortToFull = shortToFull;
  }

  public getShorts(): Observable<Short[]> {
    return combineLatest(
      [...this.store.values()]
    ).pipe(
      map(res => res.map(full => this.fullToShort(full)))
    );
  }

  public async setShorts(shorts: Promise<Short[]> | Short[]): Promise<void> {
    (await shorts)
      .filter(short => !this.store.has(short.id))
      .forEach(short => {
        const full = this.shortToFull(short);
        this.store.set(short.id, new BehaviorSubject<Full>(full));
      });
  }

  public getChat(id: number): Observable<Full> {
    return this.store.get(id).pipe(
      filter(full => full.hasOwnProperty('id')),
      filter(full => full.isFullyLoaded),
      map(full => cloneDeep(full)) // immutable
    );
  }

  public isChatFullyLoaded(id: number): boolean {
    return this.store.has(id) && this.store.get(id).value.isFullyLoaded;
  }

  public lastLoadedChatMessageId(id: number): number {
    const channel = this.store.get(id).value;
    return channel.messages.length ? channel.messages.at(-1).id : 0;
  }

  public async setChat(id: number, newChat: Full | Promise<Full>): Promise<void> {
    let chat$: BehaviorSubject<Full>;
    if (this.store.has(id)) {
      // fully load short chat or update existing chat
      chat$ = this.store.get(id);
      chat$.value.isFullyLoaded = true;
    }
    else {
      const pseudoLoad = {
        messages: [],
        unreadMessagesCount: 0,
        isFullyLoaded: true,
      } as Full;
      chat$ = this.store.get(id) ?? new BehaviorSubject<Full>(pseudoLoad);
      this.store.set(id, chat$);
    }
    chat$.next({
      ...(await newChat),
      isFullyLoaded: true,
      // IGNORE MESSAGES ARRAY
      unreadMessagesCount: chat$.value.unreadMessagesCount,
      messages: chat$.value.messages
    });
  }

  public async updateChatMessages(
    id: number,
    newMessages: ChatMessage[] | Promise<ChatMessage[]>,
    position: 'start' | 'end'
  ): Promise<void> {
    const chat$ = this.store.get(id);
    let messages: ChatMessage[];
    switch (position) {
      case 'start':
        messages = [...(await newMessages), ...chat$.value.messages];
        break;
      case 'end':
        messages = [...chat$.value.messages, ...(await newMessages)];
        break;
    }
    chat$.next({
      ...chat$.value,
      messages,
      // todo think about limit check logic
      isLimitMessagesAchieved: messages.some(message => message.id === 1)
    });
  }
}
