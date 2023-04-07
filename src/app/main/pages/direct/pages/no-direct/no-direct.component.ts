import { Component, OnInit } from '@angular/core';
import { ReactiveViewControllerService } from '../../../../services/reactive-view-controller.service';

@Component({
  selector: 'app-no-direct',
  templateUrl: './no-direct.component.html',
  styleUrls: ['./no-direct.component.scss'],
})
export class NoDirectComponent implements OnInit {

  constructor(private readonly viewController: ReactiveViewControllerService) { }

  ngOnInit(): void {
    this.viewController.clearHeaderTemplate();
    this.viewController.clearEndSideMenuTemplate();
  }

}
