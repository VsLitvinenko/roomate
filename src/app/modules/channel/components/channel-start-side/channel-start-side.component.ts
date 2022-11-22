import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ShortChannel } from '../../../../api/channels-api';
import { ChannelsSelectService } from '../../services/channels-select.service';

@Component({
  selector: 'app-channel-start-side',
  templateUrl: './channel-start-side.component.html',
  styleUrls: ['./channel-start-side.component.scss'],
})
export class ChannelStartSideComponent implements OnInit {

  public publicChannels$: Observable<ShortChannel[]>;
  public privateChannels$: Observable<ShortChannel[]>;

  constructor(private readonly channelsSelect: ChannelsSelectService) { }

  ngOnInit(): void {
    const hotChannels$ = this.channelsSelect.getShortChannels();
    this.publicChannels$ = hotChannels$.pipe(
      map(channels => channels.filter(item => !item.private))
    );
    this.privateChannels$ = hotChannels$.pipe(
      map(channels => channels.filter(item => item.private))
    );
  }

  public trackById(index: number, item: ShortChannel): number {
    return item.id;
  }
}
