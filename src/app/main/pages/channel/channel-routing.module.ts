import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChannelPage } from './channel.page';
import { CurrentChannelComponent, NoChannelComponent } from './pages';

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
