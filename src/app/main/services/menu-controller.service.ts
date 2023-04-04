import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface EndSideMenuTemplate {
  component: any;
  injector?: Injector;
}

@Injectable()
export class MenuControllerService {

  private startSideMenuComponent$$ = new BehaviorSubject<any>(null);
  private endSideMenuTemplate$$ = new BehaviorSubject<EndSideMenuTemplate>(null);

  constructor() { }

  public get startSideMenuComponent$(): Observable<any> {
    return this.startSideMenuComponent$$.asObservable();
  }

  public get endSideMenuTemplate$(): Observable<EndSideMenuTemplate> {
    return this.endSideMenuTemplate$$.asObservable();
  }

  public setStartSideMenuComponent(newComponent: any): void {
    this.startSideMenuComponent$$.next(newComponent);
  }

  public setEndSideMenuTemplate(newTemplate: EndSideMenuTemplate): void {
    this.endSideMenuTemplate$$.next(newTemplate);
  }

  public clearEndSideMenuTemplate(): void {
    this.endSideMenuTemplate$$.next(null);
  }

}
