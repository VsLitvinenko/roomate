import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DirectRoutingModule } from './direct-routing.module';
import { DirectPage } from './direct.page';
import { SharedModule } from '../../../shared';
import { NoDirectComponent, CurrentDirectComponent } from './pages';
import { DirectStartSideComponent, DirectEndSideComponent } from './components';

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
