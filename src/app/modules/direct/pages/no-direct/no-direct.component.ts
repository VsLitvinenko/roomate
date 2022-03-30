import { Component, OnInit } from '@angular/core';
import { MenuControllerService } from '../../../../main/services/menu-controller.service';

@Component({
  selector: 'app-no-direct',
  templateUrl: './no-direct.component.html',
  styleUrls: ['./no-direct.component.scss'],
})
export class NoDirectComponent implements OnInit {

  constructor(private readonly menuController: MenuControllerService) { }

  ngOnInit() {}

  // proxy by ion-router-outlet
  ionViewWillEnter(): void {
    this.menuController.clearEndSideMenuTemplate();
  }

}
