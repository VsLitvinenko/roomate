import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChannelPage } from './view/channel.page';
import {CurrentChannelComponent} from './pages/current-channel/current-channel.component';
import {NoChannelComponent} from './pages/no-channel/no-channel.component';

const routes: Routes = [
  {
    path: '',
    component: ChannelPage,
    children: [
      {
        path: 'current/:id',
        component: CurrentChannelComponent,
      },
      {
        path: 'not-found',
        component: NoChannelComponent,
      },
      {
        path: '**',
        redirectTo: 'not-found',
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
