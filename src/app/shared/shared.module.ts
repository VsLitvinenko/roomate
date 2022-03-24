import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DarkModeService } from './services/dark-mode.service';
import { SharedHeaderComponent } from './components/shared-header/shared-header.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
  ],
  declarations: [
    SharedHeaderComponent,
  ],
  providers: [
    DarkModeService,
  ],
  exports: [
    SharedHeaderComponent,
  ]
})
export class SharedModule { }
