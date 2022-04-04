import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RoomPageRoutingModule } from './room-routing.module';
import { RoomPage } from './view/room.page';
import { SharedModule } from '../shared/shared.module';
import { JanusService } from './janus/janus.service';
import { PublisherComponent } from './components/publisher/publisher.component';
import { RoomStartSideComponent } from './components/room-start-side/room-start-side.component';

const commonComponents = [
  PublisherComponent,
  RoomStartSideComponent,
];

const pagesComponents = [
  RoomPage,
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
    JanusService,
  ]
})
export class RoomPageModule {}
