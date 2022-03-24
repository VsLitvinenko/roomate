import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChannelChatPageRoutingModule } from './channel-chat-routing.module';
import { CurrentChatComponent } from './components/current-chat/current-chat.component';
import { NoChatComponent } from './components/no-chat/no-chat.component';
import { SharedModule } from '../../../../modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChannelChatPageRoutingModule,
    SharedModule
  ],
  declarations: [
    CurrentChatComponent,
    NoChatComponent,
  ]
})
export class ChannelChatPageModule {}
