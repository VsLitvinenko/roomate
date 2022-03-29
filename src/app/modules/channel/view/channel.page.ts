import { Component, OnInit } from '@angular/core';
import { splitPaneBreakPoint } from '../../shared/constants';
import { MenuControllerService } from '../../../main/services/menu-controller.service';
import { ChannelStartSideComponent } from '../components/channel-start-side/channel-start-side.component';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.page.html',
  styleUrls: ['./channel.page.scss'],
})
export class ChannelPage implements OnInit {
  public readonly splitPaneSize = splitPaneBreakPoint.size;

  constructor(private readonly menuController: MenuControllerService) {
  }

  ngOnInit(): void {
  }

  // proxy by ion-router-outlet
  ionViewWillEnter(): any {
    this.menuController.setStartSideMenuComponent(ChannelStartSideComponent);
  }

}
