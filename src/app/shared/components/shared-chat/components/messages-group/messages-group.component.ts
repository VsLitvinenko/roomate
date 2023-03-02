import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ChatMessage, UserInfo } from '../../../../../core';
import { isAppFullWidth$ } from '../../../../common';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-messages-group',
  templateUrl: './messages-group.component.html',
  styleUrls: ['./messages-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesGroupComponent {
  @Input() public messages: ChatMessage[] = [];
  @Input() public user: UserInfo;
  @Input() public self: boolean;

  public readonly isMobile$ = isAppFullWidth$.pipe(
    map(value => !value)
  );

  constructor() { }

  public openUser(): void {
    alert(this.user.id);
  }

}
