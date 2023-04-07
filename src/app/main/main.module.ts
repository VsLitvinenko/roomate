import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MainComponent } from './view/main.component';
import { MainRoutingModule } from './main-routing.module';
import { CommonModule } from '@angular/common';
import { TabsComponent, ProfileHeaderComponent, PageHeaderComponent } from './components';
import { ReactiveViewControllerService } from './services/reactive-view-controller.service';
import { SharedModule } from '../shared';

const components = [
  TabsComponent,
  ProfileHeaderComponent,
  PageHeaderComponent,
];

@NgModule({
  declarations: [
    MainComponent,
    ...components
  ],
  imports: [
    CommonModule,
    IonicModule,
    MainRoutingModule,
    SharedModule,
  ],
  providers: [
    ReactiveViewControllerService
  ]
})
export class MainModule {}
