import { Component, OnInit } from '@angular/core';
import { MenuControllerService } from '../../../../services/menu-controller.service';

@Component({
  selector: 'app-no-direct',
  templateUrl: './no-direct.component.html',
  styleUrls: ['./no-direct.component.scss'],
})
export class NoDirectComponent implements OnInit {

  constructor(private readonly menuController: MenuControllerService) { }

  ngOnInit(): void {
    this.menuController.clearEndSideMenuTemplate();
  }

}
