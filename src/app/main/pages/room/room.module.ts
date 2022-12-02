import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RoomPageRoutingModule } from './room-routing.module';
import { RoomPage } from './view/room.page';
import { SharedModule } from '../../../shared';
import {
  JanusMainService,
  JanusSubscribeService,
  JanusShareScreenService,
  JanusPublisherService
} from './janus';
import {
  RoomStartSideComponent,
  RoomEndSideComponent,
  StreamComponent,
  MediaFooterComponent
} from './components';

const commonComponents = [
  StreamComponent,
  MediaFooterComponent,
  RoomStartSideComponent,
  RoomEndSideComponent,
];

const pagesComponents = [
  RoomPage,
];

const services = [
  JanusMainService,
  JanusPublisherService,
  JanusSubscribeService,
  JanusShareScreenService,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoomPageRoutingModule,
    SharedModule
  ],
  declarations: [
    ...pagesComponents,
    ...commonComponents,
  ],
  providers: [
    ...services,
  ]
})
export class RoomPageModule {}
