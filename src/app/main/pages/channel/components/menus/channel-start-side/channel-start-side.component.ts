import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { ChannelsDataService } from '../../../services';
import { partition } from 'lodash-es';
import { StoreShortChannel } from '../../../../../../core';
import { CreateChannelModalService } from '../../create-channel-modal/create-channel-modal.service';
import { LocalizationService } from '../../../../../../shared';

interface ShortChannelsFolder {
  value: string;
  title: string;
  icon: string;
  channels: StoreShortChannel[];
}

@Component({
  selector: 'app-channel-start-side',
  templateUrl: './channel-start-side.component.html',
  styleUrls: ['./channel-start-side.component.scss'],
})
export class ChannelStartSideComponent implements OnInit {

  public searchEvent$ = new BehaviorSubject<string>(null);
  public channelFolders$ = combineLatest([
    this.getChannelFolders(),
    this.searchEvent$
  ]).pipe(
    map(([folders, search]) => folders.map(item => ({
      ...item,
      channels: item.channels.filter(
        channel => search === null || channel.title.trim().toLowerCase().includes(search.trim().toLowerCase())
      )
    })).filter(item => item.channels.length))
  );

  constructor(private readonly channelsData: ChannelsDataService,
              private readonly createModalService: CreateChannelModalService,
              private readonly localizationService: LocalizationService) { }

  ngOnInit(): void {
  }

  public async openCreateChannelModal(): Promise<void> {
    await this.createModalService.openModal();
  }

  public trackByValue(index: number, item: ShortChannelsFolder): string {
    return item.value;
  }

  public trackById(index: number, item: StoreShortChannel): number {
    return item.id;
  }

  private getChannelFolders(): Observable<ShortChannelsFolder[]> {
    return this.channelsData.shortChannels$.pipe(
      map(channels =>
        partition(channels, item => !item.private)
          .map(folder => {
            const isPrivate = folder[0]?.private;
            return {
              value: isPrivate ? 'private' : 'public',
              title: this.localizationService.localize([(isPrivate ? 'privates' : 'publics'), 'channels']),
              icon: isPrivate ? 'lock-closed-outline' : 'people-outline',
              channels: folder,
            };
          })
      )
    );
  }
}
