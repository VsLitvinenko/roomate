import { AfterViewInit, ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { ChannelsDataService } from '../../services';
import { IonModal } from '@ionic/angular';
import { UsersService, User, StoreChannel } from '../../../../../core';
import { isTouchDevice } from '../../../../../shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

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
  public readonly isTouchDevise = isTouchDevice;
  public isNotify = true;

  constructor(private readonly channelsData: ChannelsDataService,
              private readonly users: UsersService) { }

  ngAfterViewInit(): void {
    this.modal.ionModalWillPresent.pipe(
      untilDestroyed(this)
    ).subscribe(() => this.channel$ = this.channelsData.getChannel(this.channelId));
  }

  public changeNotify(): void {
    this.isNotify = !this.isNotify;
  }

  public getChannelUsers(members: number[]): Observable<User[]> {
    return combineLatest(
      members.map(id => this.users.getUser(id))
    );
  }

  public getOnlineUsersCount(users: User[]): number {
    return users.filter(user => user.online).length;
  }

}
