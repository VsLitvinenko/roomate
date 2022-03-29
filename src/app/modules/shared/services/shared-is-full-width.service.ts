import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import {map, shareReplay, startWith} from 'rxjs/operators';
import { splitPaneBreakPoint } from '../constants';

const minWidth = splitPaneBreakPoint.minWidth;

@Injectable({
  providedIn: 'root'
})
export class SharedIsFullWidthService {

  public readonly isAppFullWidth$: Observable<boolean> = fromEvent(window, 'resize')
    .pipe(
      map((event: any) => event.target.innerWidth > minWidth ),
      startWith(window.innerWidth > minWidth),
      shareReplay(1),
    );

  constructor() {
  }
}
