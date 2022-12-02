import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChannelPageRoutingModule } from './channel-routing.module';
import { ChannelPage } from './channel.page';
import { SharedModule } from '../../../shared';
import { NoChannelComponent, CurrentChannelComponent } from './pages';
import { ChannelStartSideComponent, ChannelEndSideComponent, ChannelInfoComponent } from './components';

const commonComponents = [
  ChannelEndSideComponent,
  ChannelStartSideComponent,
  ChannelInfoComponent,
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
