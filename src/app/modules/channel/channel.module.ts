import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChannelPageRoutingModule } from './channel-routing.module';
import { ChannelPage } from './view/channel.page';
import { SharedModule } from '../shared/shared.module';
import { NoChannelComponent } from './pages/no-channel/no-channel.component';
import { CurrentChannelComponent } from './pages/current-channel/current-channel.component';
import { ChannelStartSideComponent } from './components/channel-start-side/channel-start-side.component';
import { ChannelEndSideComponent } from './components/channel-end-side/channel-end-side.component';

const commonComponents = [
  ChannelEndSideComponent,
  ChannelStartSideComponent,
];

const pagesComponents = [
  NoChannelComponent,
  CurrentChannelComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChannelPageRoutingModule,
    SharedModule,
  ],
  declarations: [
    ChannelPage,
    ...commonComponents,
    ...pagesComponents,
  ]
})
export class ChannelPageModule {}
