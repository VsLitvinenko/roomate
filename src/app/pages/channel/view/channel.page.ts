import { Component, OnInit } from '@angular/core';
import { splitPaneBreakPoint } from '../../../modules/shared/constants';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.page.html',
  styleUrls: ['./channel.page.scss'],
})
export class ChannelPage implements OnInit {
  public readonly splitPaneSize = splitPaneBreakPoint.size;

  constructor() { }

  ngOnInit() {
  }

}
