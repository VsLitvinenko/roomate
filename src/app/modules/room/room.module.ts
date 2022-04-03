import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RoomPageRoutingModule } from './room-routing.module';
import { RoomPage } from './view/room.page';
import { SharedModule } from '../shared/shared.module';
import { JanusService } from './janus/janus.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoomPageRoutingModule,
    SharedModule
  ],
  declarations: [
    RoomPage,
  ],
  providers: [
    JanusService,
  ]
})
export class RoomPageModule {}
