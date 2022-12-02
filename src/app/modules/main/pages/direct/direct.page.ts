import { Component, OnInit } from '@angular/core';
import { MenuControllerService } from '../../services/menu-controller.service';
import { DirectStartSideComponent } from './components/menus/direct-start-side/direct-start-side.component';

@Component({
  selector: 'app-direct',
  template: `
    <ion-router-outlet id="menu-content"
                       animated="false">
    </ion-router-outlet>
  `,
})
export class DirectPage implements OnInit {

  constructor(private readonly menuController: MenuControllerService) { }

  ngOnInit(): void {
  }

  ionViewWillEnter(): void {
    this.menuController.setStartSideMenuComponent(DirectStartSideComponent);
  }

  ionViewWillLeave(): void {
    this.menuController.clearEndSideMenuTemplate();
  }

}
