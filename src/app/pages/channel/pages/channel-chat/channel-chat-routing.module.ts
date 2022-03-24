import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NoChatComponent} from './components/no-chat/no-chat.component';
import {CurrentChatComponent} from './components/current-chat/current-chat.component';

const routes: Routes = [
  {
    path: 'current/:id',
    component: CurrentChatComponent
  },
  {
    path: 'not-found',
    component: NoChatComponent
  },
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChannelChatPageRoutingModule {}
