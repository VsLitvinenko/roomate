import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DarkModeService } from './services/dark-mode.service';
import { SharedHeaderComponent } from './components/shared-header/shared-header.component';
import { IonicModule } from '@ionic/angular';
import { ScrollbarThemeDirective } from './directives/scrollbar-theme-directive';
import { SharedProfileSideComponent } from './components/shared-profile-side/shared-profile-side.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
  ],
  declarations: [
    SharedHeaderComponent,
    SharedProfileSideComponent,
    ScrollbarThemeDirective,
  ],
  providers: [
    DarkModeService,
  ],
  exports: [
    SharedHeaderComponent,
    SharedProfileSideComponent,
    ScrollbarThemeDirective,
  ]
})
export class SharedModule { }
