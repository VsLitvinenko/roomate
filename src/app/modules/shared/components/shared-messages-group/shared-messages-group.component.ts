import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-shared-messages-group',
  templateUrl: './shared-messages-group.component.html',
  styleUrls: ['./shared-messages-group.component.scss'],
})
export class SharedMessagesGroupComponent implements OnInit {
  @Input() public groupMessages: {
    messages: any[];
    user: any;
  };

  constructor() { }

  ngOnInit() {}

}
