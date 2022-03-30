import { Component, OnInit } from '@angular/core';
import { MenuControllerService } from '../../../../main/services/menu-controller.service';

@Component({
  selector: 'app-no-chat',
  templateUrl: './no-channel.component.html',
  styleUrls: ['./no-channel.component.scss'],
})
export class NoChannelComponent implements OnInit {

  constructor(private readonly menuController: MenuControllerService) { }

  ngOnInit() {}

  // proxy by ion-router-outlet
  ionViewWillEnter(): void {
    this.menuController.clearEndSideMenuTemplate();
  }

}
