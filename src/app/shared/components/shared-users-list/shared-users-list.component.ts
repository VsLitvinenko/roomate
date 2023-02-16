import { Component, Input } from '@angular/core';
import { User } from 'src/app/core';

@Component({
  selector: 'app-shared-users-list',
  templateUrl: './shared-users-list.component.html',
  styleUrls: ['./shared-users-list.component.scss'],
})
export class SharedUsersListComponent {
  @Input() public usersList: User[];

  constructor() { }
}
