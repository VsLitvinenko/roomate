import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Message } from '../api/channels-api';

export interface FullChat {
  id: number;
  isFullyLoaded?: boolean;
  unreadMessagesCount?: number;
  messages?: Message[];
}

export interface ShortChat {
  id: number;
  unreadMessagesCount: number;
}

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
      map(value => Object.values(value).map(full => this.fullToShort(full)))
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
      filter(full => full.isFullyLoaded)
    );
  }

  public isChatFullyLoaded(id: number): boolean {
    return this.store.has(id) && this.store.get(id).value.isFullyLoaded;
  }

  public lastChatMessage(id: number): number {
    return this.store.get(id).value.messages.length;
  }

  public async setChat(id: number, newChat: Full | Promise<Full>): Promise<void> {
    let chat$: BehaviorSubject<Full>;
    if (this.store.has(id)) {
      // fully load short chat or update existing chat
      chat$ = this.store.get(id);
      chat$.value.isFullyLoaded = true;
    }
    else {
      const pseudoLoad = { isFullyLoaded: true } as Full;
      chat$ = this.store.get(id) ?? new BehaviorSubject<Full>(pseudoLoad);
      this.store.set(id, chat$);
    }
    chat$.next({
      ...(await newChat),
      isFullyLoaded: true,
      unreadMessagesCount: chat$.value?.unreadMessagesCount ?? 0,
      messages: chat$.value?.messages ?? []
    });
  }

  public async updateChatMessages(
    id: number,
    newMessages: Message[] | Promise<Message[]>,
    position: 'start' | 'end'
  ): Promise<void> {
    const chat$ = this.store.get(id);
    let messages: Message[];
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
      messages
    });
  }
}
