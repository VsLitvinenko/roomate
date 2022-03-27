import { Component, OnInit } from '@angular/core';
import { splitPaneBreakPoint } from '../../shared/constants';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.page.html',
  styleUrls: ['./channel.page.scss'],
})
export class ChannelPage implements OnInit {
  public readonly splitPaneSize = splitPaneBreakPoint.size;

  constructor(private readonly menuController: MenuController) { }

  ngOnInit(): void {
    // this.menuController.open('start-menu').then();
  }

}
