import { Component, OnInit } from '@angular/core';
import { InjectableDataClass } from 'src/app/core/services/injector.service';
import { rooms } from './data-source';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-end-side-menu',
  templateUrl: './channel-end-side.component.html',
  styleUrls: ['./channel-end-side.component.scss'],
})
export class ChannelEndSideComponent implements OnInit {

  public readonly rooms = rooms;
  public readonly channelId$: BehaviorSubject<number>;

  constructor(private item: InjectableDataClass<BehaviorSubject<number>>) {
    this.channelId$ = item.injectedItem;
  }

  ngOnInit(): void {
  }

}
