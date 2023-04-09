import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface EndSideMenuTemplate {
  component: any;
  withValue?: BehaviorSubject<any>;
}

export interface HeaderTemplate {
  template: TemplateRef<any>;
  endSideButtonIcon: string;
}

@Injectable()
export class ReactiveViewControllerService {

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
  public setEndSideMenuTemplate(newComponent: any, withValue?: any): void {
    if (this.endSideMenuTemplate$.value?.component === newComponent) {
      this.endSideMenuTemplate$.value.withValue.next(withValue);
      return;
    }
    const newTemplate = newComponent ? {
      component: newComponent,
      withValue: new BehaviorSubject<any>(withValue)
    } : null;
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
