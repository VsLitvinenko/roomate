import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChannelChatPageRoutingModule } from './channel-chat-routing.module';
import {CurrentChatComponent} from './pages/current-chat/current-chat.component';
import {NoChatComponent} from './pages/no-chat/no-chat.component';
import {ChannelHeaderComponent} from './components/channel-header/channel-header.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChannelChatPageRoutingModule
  ],
  declarations: [
    CurrentChatComponent,
    NoChatComponent,
    ChannelHeaderComponent,
  ]
})
export class ChannelChatPageModule {}
