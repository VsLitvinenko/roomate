import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { UserInfo } from '../../../core';

@Component({
  selector: 'app-shared-users-list',
  templateUrl: './shared-users-list.component.html',
  styleUrls: ['./shared-users-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedUsersListComponent {
  @Input() public usersList: UserInfo[];
  @Output() public userSelected = new EventEmitter<UserInfo>();

  constructor() { }

  public trackById(index: number, item: UserInfo): number | string {
    return item.id;
  }
}
