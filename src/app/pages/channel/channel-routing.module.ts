import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChannelPage } from './view/channel.page';

const routes: Routes = [
  {
    path: '',
    component: ChannelPage,
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatPageModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChannelPageRoutingModule {}
