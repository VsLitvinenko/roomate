import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { ChannelsDataService } from '../../services/channels-data.service';
import { StoreChannel } from '../../../../stores/channels.store';
import { IonModal } from '@ionic/angular';
import { UsersService } from '../../../shared/services/users.service';
import { User } from '../../../../api/users-api';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-channel-info',
  templateUrl: './channel-info.component.html',
  styleUrls: ['./channel-info.component.scss'],
})
export class ChannelInfoComponent implements OnInit {
  @Input() public channelId: number;
  @Input() public selfModal: IonModal;
  public channel$: Observable<StoreChannel>;
  public isNotify = true;

  constructor(private readonly channelsData: ChannelsDataService,
              private readonly users: UsersService) { }

  ngOnInit(): void {
    this.channel$ = this.channelsData.getChannel(this.channelId);
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
