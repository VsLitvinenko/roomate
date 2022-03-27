import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartSideMenuPage } from './view/start-side-menu.page';
import { ChannelStartSideComponent } from './pages/channel-start-side/channel-start-side.component';
import { DirectStartSideComponent } from './pages/direct-start-side/direct-start-side.component';

const routes: Routes = [
  {
    path: '',
    component: StartSideMenuPage,
    children: [
      {
        path: 'channel',
        component: ChannelStartSideComponent,
      },
      {
        path: 'direct',
        component: DirectStartSideComponent,
      },
      {
        path: '**',
        redirectTo: '/channel(content:channel/not-found)',
        pathMatch: 'full'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartSideMenuRoutingModule {}
