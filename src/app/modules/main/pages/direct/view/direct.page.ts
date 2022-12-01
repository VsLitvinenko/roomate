import { Component, OnInit } from '@angular/core';
import { MenuControllerService } from '../../../services/menu-controller.service';
import { DirectStartSideComponent } from '../components/menus/direct-start-side/direct-start-side.component';

@Component({
  selector: 'app-direct',
  templateUrl: './direct.page.html',
  styleUrls: ['./direct.page.scss'],
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
