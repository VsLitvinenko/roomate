import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChannelPageRoutingModule } from './channel-routing.module';
import { ChannelPage } from './channel.page';
import { SharedModule } from '../../../shared';
import { NoChannelComponent, CurrentChannelComponent } from './pages';
import {
  ChannelStartSideComponent,
  ChannelEndSideComponent,
  ChannelInfoModalComponent,
  CreateChannelModalComponent,
} from './components';

const commonComponents = [
  ChannelEndSideComponent,
  ChannelStartSideComponent,
  ChannelInfoModalComponent,
  CreateChannelModalComponent
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
