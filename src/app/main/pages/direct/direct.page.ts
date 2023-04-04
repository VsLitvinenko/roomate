import { Component, OnInit } from '@angular/core';
import { MenuControllerService } from '../../services/menu-controller.service';
import { DirectStartSideComponent } from './components';

@Component({
  selector: 'app-direct',
  template: `
    <router-outlet></router-outlet>
  `,
})
export class DirectPage implements OnInit {

  constructor(private readonly menuController: MenuControllerService) { }

  ngOnInit(): void {
    this.menuController.setStartSideMenuComponent(DirectStartSideComponent);
  }

}
