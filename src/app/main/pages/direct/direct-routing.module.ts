import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DirectPage } from './direct.page';
import { CurrentDirectComponent, NoDirectComponent } from './pages';

const routes: Routes = [
  {
    path: '',
    component: DirectPage,
    children: [
      {
        path: 'current/:id',
        component: CurrentDirectComponent,
      },
      {
        path: 'not-found',
        component: NoDirectComponent,
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
export class DirectRoutingModule {}
