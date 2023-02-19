import { BehaviorSubject, combineLatest, Observable, switchMap } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { cloneDeep } from 'lodash-es';
import { ChatMessage, FullChat, ShortChat } from './interfaces';

export abstract class Store<Full extends FullChat, Short extends ShortChat> {

  private readonly fullToShort: (x: Full) => Short;
  private readonly shortToFull: (x: Short) => Full;

  private readonly store = new Map<number, BehaviorSubject<Full>>();
  private readonly refreshList$ = new BehaviorSubject<void>(void 0);

  protected constructor(
    fullToShort: (x: Full) => Short,
    shortToFull: (x: Short) => Full
  ) {
    this.fullToShort = fullToShort;
    this.shortToFull = shortToFull;
  }

  public getShorts(): Observable<Short[]> {
    return this.refreshList$.pipe(
      switchMap(() => combineLatest([...this.store.values()])),
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
    return channel.messages?.length ? channel.messages.at(-1).id : 0;
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
        messages: null,
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
    this.refreshList$.next(void 0);
  }

  public async updateChatMessages(
    id: number,
    newMessages: ChatMessage[] | Promise<ChatMessage[]>,
    position: 'start' | 'end',
    options: {
      isTopMesLimitAchieved?: boolean;
    } = {}
  ): Promise<void> {
    const chat$ = this.store.get(id);
    const existMessages = chat$.value.messages ?? [];
    let messages: ChatMessage[];
    switch (position) {
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
      isTopMesLimitAchieved: options.isTopMesLimitAchieved ?? false
    });
  }
}
