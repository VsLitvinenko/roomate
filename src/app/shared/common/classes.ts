import { Observable, Subject, throttleTime } from 'rxjs';

export class HotMap<K, V> extends Map<K, V> {

  private readonly valuesUpdated$ = new Subject<IterableIterator<V>>();

  public get valuesUpdated(): Observable<IterableIterator<V>> {
    return this.valuesUpdated$.asObservable();
  }

  public set(key: K, value: V): this {
    super.set(key, value);
    this.valuesUpdated$.next(super.values());
    return this;
  }

  public setMany(entries: readonly (readonly [K, V])[]): this {
    entries.forEach(([key, value]) => super.set(key, value));
    this.valuesUpdated$.next(super.values());
    return this;
  }
}

export class ReusableComponent {
  private readonly reused$ = new Subject<void>();
  private readonly stored$ = new Subject<void>();

  public get reused(): Observable<void> {
    return this.reused$.pipe(
      throttleTime(100)
    );
  }

  public get stored(): Observable<void> {
    return this.stored$.asObservable();
  }

  public triggerReuse(): void {
    this.reused$.next(void 0);
  }

  public triggerStore(): void {
    this.stored$.next(void 0);
  }
}
