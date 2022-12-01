import { Component, Input } from '@angular/core';
import { Message } from '../../../../../api/channels-api';
import { User } from '../../../../../api/users-api';

@Component({
  selector: 'app-shared-messages-group',
  templateUrl: './shared-messages-group.component.html',
  styleUrls: ['./shared-messages-group.component.scss'],
})
export class SharedMessagesGroupComponent {
  @Input() public messages: Message[] = [];
  @Input() public user: User;
  @Input() public self: boolean;

  constructor() { }

  public openUser(): void {
    alert(this.user.id);
  }

}
