import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserInfo, UsersService } from '../../../../../core';
import { BehaviorSubject, of, switchMap } from 'rxjs';
import { ChannelsDataService } from '../../services';

@Component({
  selector: 'app-create-channel-modal',
  templateUrl: './create-channel-modal.component.html',
  styleUrls: ['./create-channel-modal.component.scss'],
})
export class CreateChannelModalComponent implements OnInit {

  public readonly searchUserList$ = this.users.getUsersList([1, 2, 3, 4, 5, 6]);

  public readonly membersIds$ = new BehaviorSubject<number[]>([this.users.selfId]);

  public readonly members$ = this.membersIds$.pipe(
    switchMap(ids => ids.length ? this.users.getUsersList(ids) : of([]))
  );

  constructor(private readonly modalCtrl: ModalController,
              private readonly channelsData: ChannelsDataService,
              private readonly users: UsersService) { }

  ngOnInit(): void {}

  public async closeModal(): Promise<void> {
    await this.modalCtrl.dismiss();
  }

  public createChannel(title: string | number, isPrivate: boolean): void {
    this.channelsData.createChannel(
      String(title),
      isPrivate,
      this.membersIds$.value
    ).then(() => this.closeModal());
  }

  public userSelected(user: UserInfo): void {
    this.membersIds$.next([
      ...this.membersIds$.value,
      user.id
    ]);
  }

  public userDeleted(user: UserInfo): void {
    const newValue = this.membersIds$.value;
    const index = newValue.findIndex(id => user.id === id);
    if (index !== -1) {
      newValue.splice(index, 1);
      this.membersIds$.next(newValue);
    }
  }

}
