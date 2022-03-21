import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-channel-header',
  templateUrl: './channel-header.component.html',
  styleUrls: ['./channel-header.component.scss'],
})
export class ChannelHeaderComponent implements OnInit {
  @Input() public title: string;

  constructor() { }

  ngOnInit() {}

}
