import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChannelPageRoutingModule } from './channel-routing.module';
import { ChannelPage } from './view/channel.page';
import { SideMenuComponent } from './components/side-menu/side-menu.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChannelPageRoutingModule
  ],
  declarations: [
    ChannelPage,
    SideMenuComponent,
  ]
})
export class ChannelPageModule {}
