import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {testMessages} from './data-source';

@Component({
  selector: 'app-current-chat',
  templateUrl: './current-chat.component.html',
  styleUrls: ['./current-chat.component.scss'],
})
export class CurrentChatComponent implements OnInit {
  public channelId: string;

  public dataSource = testMessages;

  constructor(private readonly activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params
      .subscribe(params => this.channelId = params.id);
  }

}
