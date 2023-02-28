import { Observable, Subject } from 'rxjs';

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
