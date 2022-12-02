import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DirectRoutingModule } from './direct-routing.module';
import { DirectPage } from './direct.page';
import { SharedModule } from '../../../shared';
import { NoDirectComponent } from './pages/no-direct/no-direct.component';
import { CurrentDirectComponent } from './pages/current-direct/current-direct.component';
import { DirectStartSideComponent } from './components/menus/direct-start-side/direct-start-side.component';
import { DirectEndSideComponent } from './components/menus/direct-end-side/direct-end-side.component';

const commonComponents = [
  DirectEndSideComponent,
  DirectStartSideComponent,
];

const pagesComponents = [
  NoDirectComponent,
  CurrentDirectComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DirectRoutingModule,
    SharedModule,
  ],
  declarations: [
    DirectPage,
    ...commonComponents,
    ...pagesComponents,
  ]
})
export class DirectModule {}
