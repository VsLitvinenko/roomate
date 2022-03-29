import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class MenuControllerService {

  private startSideMenuComponent$$ = new Subject<any>();

  constructor() { }

  public get startSideMenuComponent$(): Observable<any> {
    return this.startSideMenuComponent$$.asObservable();
  }

  public setStartSideMenuComponent(newComponent: any): void {
    this.startSideMenuComponent$$.next(newComponent);
  }

}
