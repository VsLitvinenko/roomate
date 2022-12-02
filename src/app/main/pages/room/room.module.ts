import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RoomPageRoutingModule } from './room-routing.module';
import { RoomPage } from './view/room.page';
import { SharedModule } from '../../../shared/shared.module';
import { JanusMainService } from './janus/janus-main.service';
import { StreamComponent } from './components/stream/stream.component';
import { RoomStartSideComponent } from './components/menus/room-start-side/room-start-side.component';
import { RoomEndSideComponent } from './components/menus/room-end-side/room-end-side.component';
import { JanusSubscribeService } from './janus/services/janus-subscribe.service';
import { MediaFooterComponent } from './components/media-footer/media-footer.component';
import { JanusShareScreenService } from './janus/services/janus-share-screen.service';
import { JanusPublisherService } from './janus/services/janus-publisher.service';

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
