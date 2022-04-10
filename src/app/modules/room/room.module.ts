import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RoomPageRoutingModule } from './room-routing.module';
import { RoomPage } from './view/room.page';
import { SharedModule } from '../shared/shared.module';
import { JanusMainService } from './janus/services/janus-main.service';
import { StreamComponent } from './components/stream/stream.component';
import { RoomStartSideComponent } from './components/room-start-side/room-start-side.component';
import { RoomEndSideComponent } from './components/room-end-side/room-end-side.component';
import { JanusSubscribeService } from './janus/services/janus-subscribe.service';

const commonComponents = [
  StreamComponent,
  RoomStartSideComponent,
  RoomEndSideComponent,
];

const pagesComponents = [
  RoomPage,
];

const services = [
  JanusMainService,
  JanusSubscribeService,
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
