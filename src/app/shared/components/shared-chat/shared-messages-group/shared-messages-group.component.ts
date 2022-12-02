import { Component, Input } from '@angular/core';
import { Message, User } from '../../../../core';

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
