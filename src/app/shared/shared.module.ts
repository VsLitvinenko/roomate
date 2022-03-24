import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DarkModeService } from './services/dark-mode.service';
import { SharedHeaderComponent } from './components/shared-header/shared-header.component';
import { IonicModule } from '@ionic/angular';
import {ScrollbarThemeDirective} from './directives/scrollbar-theme-directive';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
  ],
  declarations: [
    SharedHeaderComponent,
    ScrollbarThemeDirective
  ],
  providers: [
    DarkModeService,
  ],
  exports: [
    SharedHeaderComponent,
    ScrollbarThemeDirective
  ]
})
export class SharedModule { }
