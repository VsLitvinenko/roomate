import { Component, OnInit } from '@angular/core';
import { splitPaneBreakPoint } from '../../shared/constants';
import { MenuControllerService } from '../../../main/services/menu-controller.service';
import { DirectStartSideComponent } from '../components/direct-start-side/direct-start-side.component';

@Component({
  selector: 'app-direct',
  templateUrl: './direct.page.html',
  styleUrls: ['./direct.page.scss'],
})
export class DirectPage implements OnInit {
  public readonly splitPaneSize = splitPaneBreakPoint.size;

  constructor(private readonly menuController: MenuControllerService) { }

  ngOnInit() {
  }

  // proxy by ion-router-outlet
  ionViewWillEnter(): void {
    this.menuController.setStartSideMenuComponent(DirectStartSideComponent);
    this.menuController.clearEndSideMenuTemplate();
  }

}
