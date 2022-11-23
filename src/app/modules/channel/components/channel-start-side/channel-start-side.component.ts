import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ShortChannel } from '../../../../api/channels-api';
import { ChannelsSelectService } from '../../services/channels-select.service';
import { partition } from 'lodash-es';

interface ShortChannelsFolder {
  value: string;
  title: string;
  icon: string;
  channels: ShortChannel[];
}

@Component({
  selector: 'app-channel-start-side',
  templateUrl: './channel-start-side.component.html',
  styleUrls: ['./channel-start-side.component.scss'],
})
export class ChannelStartSideComponent implements OnInit {

  public channelFolders$ = this.getChannelFolders();

  constructor(private readonly channelsSelect: ChannelsSelectService) { }

  ngOnInit(): void {
  }

  public trackByValue(index: number, item: ShortChannelsFolder): string {
    return item.value;
  }

  public trackById(index: number, item: ShortChannel): number {
    return item.id;
  }

  private getChannelFolders(): Observable<ShortChannelsFolder[]> {
    return this.channelsSelect.shortChannels$.pipe(
      map(channels =>
        partition(channels, item => !item.private)
          .map(folder => {
            const isPrivate = folder[0]?.private;
            return {
              value: isPrivate ? 'private' : 'public',
              title: isPrivate ? 'Private channels' : 'Public channels',
              icon: isPrivate ? 'lock-closed-outline' : 'people-outline',
              channels: folder,
            };
          })
      )
    );
  }
}
