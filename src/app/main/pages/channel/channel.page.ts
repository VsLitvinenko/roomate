import { Component, OnInit } from '@angular/core';
import { ReactiveViewControllerService } from '../../services/reactive-view-controller.service';
import { ChannelStartSideComponent } from './components';

@Component({
  selector: 'app-channel',
  template: `
    <router-outlet></router-outlet>
  `,
})
export class ChannelPage implements OnInit {
  constructor(private readonly viewController: ReactiveViewControllerService) {
  }

  ngOnInit(): void {
    this.viewController.setStartSideMenuComponent(ChannelStartSideComponent);
  }

}
