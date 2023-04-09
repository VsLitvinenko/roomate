import { Component, OnInit } from '@angular/core';
import { userData } from './data-source';
import { InjectableDataClass } from '../../../../../../core';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Component({
  selector: 'app-end-side-menu',
  templateUrl: './direct-end-side.component.html',
  styleUrls: ['./direct-end-side.component.scss'],
})
export class DirectEndSideComponent implements OnInit {
  public readonly user$: Observable<any>;
  public isNotify = true;

  constructor(private item: InjectableDataClass<BehaviorSubject<string>>) {
    this.user$ = item.injectedItem.pipe(
      map(id => userData(id))
    );
  }

  ngOnInit(): void {}

  public changeNotify(): void {
    this.isNotify = !this.isNotify;
  }

}
