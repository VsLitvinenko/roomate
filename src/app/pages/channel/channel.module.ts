import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChannelPageRoutingModule } from './channel-routing.module';
import { ChannelPage } from './view/channel.page';
import {StartSideMenuComponent} from './components/start-side-menu/start-side-menu.component';
import {EndSideMenuComponent} from './components/end-side-menu/end-side-menu.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChannelPageRoutingModule
  ],
  declarations: [
    ChannelPage,
    StartSideMenuComponent,
    EndSideMenuComponent
  ]
})
export class ChannelPageModule {}
