import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './view/main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'channel',
        loadChildren: () => import('./pages/channel/channel.module')
          .then(m => m.ChannelPageModule),
      },
      {
        path: 'direct',
        loadChildren: () => import('./pages/direct/direct.module')
          .then(m => m.DirectModule),
      },
      {
        path: 'room',
        loadChildren: () => import('./pages/room/room.module')
          .then(m => m.RoomPageModule),
      },
      {
        path: '**',
        redirectTo: 'channel',
        pathMatch: 'full',
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MainRoutingModule { }
