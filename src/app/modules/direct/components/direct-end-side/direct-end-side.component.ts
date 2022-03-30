import { Component, OnInit } from '@angular/core';
import { userData } from './data-source';
import { InjectableDataClass } from '../../../shared/services/shared-injector.service';

@Component({
  selector: 'app-end-side-menu',
  templateUrl: './direct-end-side.component.html',
  styleUrls: ['./direct-end-side.component.scss'],
})
export class DirectEndSideComponent implements OnInit {
  public readonly user = userData;
  public isNotify = true;

  constructor(private item: InjectableDataClass<string>) {
    this.user.id = parseInt(item.injectedItem, 10);
  }

  ngOnInit() {}

  public changeNotify(): void {
    this.isNotify = !this.isNotify;
  }

}
