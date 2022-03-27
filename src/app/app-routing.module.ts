import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    // star-side-menu routing
    path: '',
    loadChildren: () => import('./modules/start-side-menu/start-side-menu.module')
      .then(m => m.StartSideMenuModule),
  },
  {
    // channel-content routing
    path: 'channel',
    outlet: 'content',
    loadChildren: () => import('./modules/channel/channel.module')
      .then(m => m.ChannelPageModule),
  },
  {
    // direct-content routing
    path: 'direct',
    outlet: 'content',
      loadChildren: () => import('./modules/direct/direct.module')
        .then(m => m.DirectModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
