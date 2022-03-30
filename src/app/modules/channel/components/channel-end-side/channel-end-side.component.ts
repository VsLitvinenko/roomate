import { Component, OnInit } from '@angular/core';
import { InjectableDataClass } from 'src/app/modules/shared/services/shared-injector.service';
import { rooms } from './data-source';

@Component({
  selector: 'app-end-side-menu',
  templateUrl: './channel-end-side.component.html',
  styleUrls: ['./channel-end-side.component.scss'],
})
export class ChannelEndSideComponent implements OnInit {

  public readonly rooms = rooms;
  public channelId: string;

  constructor(private item: InjectableDataClass<string>) {
    this.channelId = item.injectedItem;
  }

  ngOnInit() {}

}
