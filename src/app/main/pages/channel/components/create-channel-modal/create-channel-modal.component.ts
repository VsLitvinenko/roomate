import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UsersService } from '../../../../../core';
import { BehaviorSubject, switchMap } from 'rxjs';

@Component({
  selector: 'app-create-channel-modal',
  templateUrl: './create-channel-modal.component.html',
  styleUrls: ['./create-channel-modal.component.scss'],
})
export class CreateChannelModalComponent implements OnInit {

  public readonly searchUserList$ = this.users.getUsersList([1, 2, 3, 4, 5, 6]);

  public readonly membersIds$ = new BehaviorSubject<number[]>([this.users.selfId]);

  public readonly members$ = this.membersIds$.pipe(
    switchMap(ids => this.users.getUsersList(ids))
  );

  constructor(private readonly modalCtrl: ModalController,
              private readonly users: UsersService) { }

  ngOnInit(): void {}

  public async closeModal(): Promise<void> {
    await this.modalCtrl.dismiss();
  }

}
