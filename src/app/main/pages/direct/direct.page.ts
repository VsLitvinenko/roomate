import { Component, OnInit } from '@angular/core';
import { ReactiveViewControllerService } from '../../services/reactive-view-controller.service';
import { DirectStartSideComponent } from './components';

@Component({
  selector: 'app-direct',
  template: `
    <router-outlet></router-outlet>
  `,
})
export class DirectPage implements OnInit {

  constructor(private readonly viewController: ReactiveViewControllerService) { }

  ngOnInit(): void {
    this.viewController.setStartSideMenuComponent(DirectStartSideComponent);
  }

}
