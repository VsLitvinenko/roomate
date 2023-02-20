import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserInfo, UsersService } from '../../../../../core';
import { BehaviorSubject, switchMap, combineLatest, of, map, Observable } from 'rxjs';
import { ChannelsDataService } from '../../services';
import { FormControl, FormGroup, Validators } from '@angular/forms';

interface MemberInfo {
  user: UserInfo;
  isPossibleToDelete: boolean;
}

@Component({
  selector: 'app-create-channel-modal',
  templateUrl: './create-channel-modal.component.html',
  styleUrls: ['./create-channel-modal.component.scss'],
})
export class CreateChannelModalComponent implements OnInit {

  public readonly searchEvent$ = new BehaviorSubject<string>(null);
  public readonly membersIds$ = new BehaviorSubject<number[]>([this.users.selfId]);
  public readonly form = new FormGroup({
    id: new FormControl(null),
    title: new FormControl('', Validators.required),
    public: new FormControl(false)
  });

  public readonly searchUserList$ = combineLatest([
    this.userListBeforeSearch$,
    this.searchEvent$
  ]).pipe(
    map(([users, search]) => users.filter(
      user => search === null || user.fullName.trim().toLowerCase().includes(search.trim().toLowerCase())
    ))
  );

  public readonly members$: Observable<MemberInfo[]> = this.membersIds$.pipe(
    switchMap(ids => this.users.getUsersList(ids)),
    map(users => users.map(user => ({ user, isPossibleToDelete: user.id !== this.users.selfId})))
  );

  constructor(private readonly modalCtrl: ModalController,
              private readonly channelsData: ChannelsDataService,
              private readonly users: UsersService) { }

  private get userListBeforeSearch$(): Observable<UserInfo[]> {
    return combineLatest([
      of([1, 2, 3, 4, 5, 6]),
      this.membersIds$
    ]).pipe(
      switchMap(([searchIds, membersIds]) => {
        const listIds = searchIds.filter(id => !membersIds.includes(id));
        return listIds.length ? this.users.getUsersList(listIds) : of([]);
      })
    );
  }

  ngOnInit(): void {}

  public trackById(index: number, item: MemberInfo): number | string {
    return item.user.id;
  }

  public async closeModal(): Promise<void> {
    await this.modalCtrl.dismiss();
  }

  public createChannel(): void {
    const formValue = this.form.getRawValue();
    this.channelsData.createChannel(
      formValue.title,
      !formValue.public,
      formValue.public ?  [] : this.membersIds$.value
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
