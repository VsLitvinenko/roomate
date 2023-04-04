import { AfterViewInit, ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { ChannelsDataService } from '../../services';
import { IonModal } from '@ionic/angular';
import { UsersService, StoreChannel, UserInfo } from '../../../../../core';
import { isTouchDevice } from '../../../../../shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { startWith } from 'rxjs/operators';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-channel-info-modal',
  templateUrl: './channel-info-modal.component.html',
  styleUrls: ['./channel-info-modal.component.scss'],
})
export class ChannelInfoModalComponent implements AfterViewInit {
  @ViewChild('infoModal') public modal: IonModal;
  @Input() public channelId: number;

  public channel$: Observable<StoreChannel>;
  public channelsUsers$: Observable<UserInfo[]>;
  public readonly isTouchDevise = isTouchDevice;
  public isNotify = true;

  constructor(private readonly channelsData: ChannelsDataService,
              private readonly users: UsersService) { }

  ngAfterViewInit(): void {
    this.modal.ionModalWillPresent.pipe(
      untilDestroyed(this)
    ).subscribe(() => {
      this.channel$ = this.channelsData.getChannel(this.channelId);
      this.channelsUsers$ = this.channel$.pipe(
        switchMap(channel => this.users.getUsersList(channel.members)),
        startWith(null) // to show skeleton users
      );
    });
  }

  public changeNotify(): void {
    this.isNotify = !this.isNotify;
  }

  public getOnlineUsersCount(users: UserInfo[]): number {
    return users.filter(user => user.online).length;
  }

}
