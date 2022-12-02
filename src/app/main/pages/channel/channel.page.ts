import { Component, OnInit } from '@angular/core';
import { splitPaneBreakPoint } from '../../../shared';
import { MenuControllerService } from '../../services/menu-controller.service';
import { ChannelStartSideComponent } from './components/menus/channel-start-side/channel-start-side.component';

@Component({
  selector: 'app-channel',
  template: `
    <ion-router-outlet id="menu-content"
                       animated="false">
    </ion-router-outlet>
  `,
})
export class ChannelPage implements OnInit {
  public readonly splitPaneSize = splitPaneBreakPoint.size;

  constructor(private readonly menuController: MenuControllerService) {
  }

  ngOnInit(): void {
  }

  ionViewWillEnter(): any {
    this.menuController.setStartSideMenuComponent(ChannelStartSideComponent);
  }

  ionViewWillLeave(): void {
    this.menuController.clearEndSideMenuTemplate();
  }

}
