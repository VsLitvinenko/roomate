import { Component, OnInit } from '@angular/core';
import { userData } from './data-source';
import { InjectableDataClass } from '../../../../../../shared/services/injector.service';

@Component({
  selector: 'app-end-side-menu',
  templateUrl: './direct-end-side.component.html',
  styleUrls: ['./direct-end-side.component.scss'],
})
export class DirectEndSideComponent implements OnInit {
  public user: any;
  public isNotify = true;

  constructor(private item: InjectableDataClass<string>) {
    this.user = userData(item.injectedItem);
  }

  ngOnInit(): void {}

  public changeNotify(): void {
    this.isNotify = !this.isNotify;
  }

}
