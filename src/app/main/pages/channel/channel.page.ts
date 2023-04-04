import { Component, OnInit } from '@angular/core';
import { MenuControllerService } from '../../services/menu-controller.service';
import { ChannelStartSideComponent } from './components';

@Component({
  selector: 'app-channel',
  template: `
    <router-outlet></router-outlet>
  `,
})
export class ChannelPage implements OnInit {
  constructor(private readonly menuController: MenuControllerService) {
  }

  ngOnInit(): void {
    this.menuController.setStartSideMenuComponent(ChannelStartSideComponent);
  }

}
