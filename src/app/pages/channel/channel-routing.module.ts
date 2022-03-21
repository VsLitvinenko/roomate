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
        loadChildren: () => import('./pages/channel-chat/channel-chat.module')
          .then( m => m.ChannelChatPageModule)
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChannelPageRoutingModule {}
