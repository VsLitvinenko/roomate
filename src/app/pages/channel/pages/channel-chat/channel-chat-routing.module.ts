import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NoChatComponent} from './pages/no-chat/no-chat.component';
import {CurrentChatComponent} from './pages/current-chat/current-chat.component';

const routes: Routes = [
  {
    path: ':id',
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
