import { Injectable, Injector } from '@angular/core';

@Injectable()
export class InjectableDataClass<T> {
  public injectedItem: T;

  constructor(value: T) {
    this.injectedItem = value;
  }
}

@Injectable({
  providedIn: 'root'
})
export class SharedInjectorService {

  constructor(private readonly inj: Injector) { }

  public createInjector<T>(injectedValue: T): Injector {
    return Injector.create([{
          provide: InjectableDataClass,
          useValue: new InjectableDataClass<T>(injectedValue)
    }], this.inj);
  }
}
