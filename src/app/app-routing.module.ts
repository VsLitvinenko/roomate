import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core';

const routes: Routes = [
  {
    path: 'app',
    canActivate: [AuthGuard],
    loadChildren: () => import('./main/main.module')
      .then(m => m.MainModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module')
      .then( m => m.LoginModule)
  },
  {
    path: '**',
    redirectTo: 'app',
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
