import { Injectable, Injector, TemplateRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface EndSideMenuTemplate {
  component: any;
  injector?: Injector;
}

export interface HeaderTemplate {
  template: TemplateRef<any>;
  endSideButtonIcon: string;
}

@Injectable()
export class MenuControllerService {

  private headerTemplate$ = new BehaviorSubject<HeaderTemplate>(null);
  private startSideMenuComponent$ = new BehaviorSubject<any>(null);
  private endSideMenuTemplate$ = new BehaviorSubject<EndSideMenuTemplate>(null);

  constructor() { }

  public get headerTemplate(): Observable<HeaderTemplate> {
    return this.headerTemplate$.asObservable();
  }
  public get startSideMenuComponent(): Observable<any> {
    return this.startSideMenuComponent$.asObservable();
  }
  public get endSideMenuTemplate(): Observable<EndSideMenuTemplate> {
    return this.endSideMenuTemplate$.asObservable();
  }

  public setHeaderTemplate(template: HeaderTemplate): void {
    this.headerTemplate$.next(template);
  }
  public setStartSideMenuComponent(newComponent: any): void {
    this.startSideMenuComponent$.next(newComponent);
  }
  public setEndSideMenuTemplate(newTemplate: EndSideMenuTemplate): void {
    this.endSideMenuTemplate$.next(newTemplate);
  }

  public clearHeaderTemplate(): void {
    this.headerTemplate$.next({
      template: null,
      endSideButtonIcon: null
    });
  }
  public clearEndSideMenuTemplate(): void {
    this.endSideMenuTemplate$.next(null);
  }

}
