import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-shared-chat-actions',
  templateUrl: './shared-chat-actions.component.html',
  styleUrls: ['./shared-chat-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedChatActionsComponent implements OnInit {
  @Output() public add = new EventEmitter<void>();
  @Output() public search = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {}

}
