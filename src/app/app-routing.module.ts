import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'channel',
    loadChildren: () => import('./modules/channel/channel.module')
      .then(m => m.ChannelPageModule),
  },
  {
    path: 'direct',
    loadChildren: () => import('./modules/direct/direct.module')
      .then(m => m.DirectModule),
  },
  {
    path: '**',
    redirectTo: 'channel',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
