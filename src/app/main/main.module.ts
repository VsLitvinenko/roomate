import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MainComponent } from './view/main.component';
import { MainRoutingModule } from './main-routing.module';
import { CommonModule } from '@angular/common';
import { TabsComponent, ProfileHeaderComponent } from './components';
import { MenuControllerService } from './services/menu-controller.service';

@NgModule({
  declarations: [
    MainComponent,
    TabsComponent,
    ProfileHeaderComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    MainRoutingModule,
  ],
  providers: [
    MenuControllerService
  ]
})
export class MainModule {}
