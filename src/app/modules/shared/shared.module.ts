import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DarkModeService } from './services/dark-mode.service';
import { SharedHeaderComponent } from './components/shared-header/shared-header.component';
import { IonicModule } from '@ionic/angular';
import { ScrollbarThemeDirective } from './directives/scrollbar-theme-directive';
import { SharedProfileSideComponent } from './components/shared-profile-side/shared-profile-side.component';
import { SharedLoaderComponent } from './components/shared-loader/shared-loader.component';

const directives = [
  ScrollbarThemeDirective,
];

const components = [
  SharedHeaderComponent,
  SharedProfileSideComponent,
  SharedLoaderComponent,
];

const services = [
  DarkModeService,
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
  ],
  declarations: [
    ...directives,
    ...components,
  ],
  providers: [
    ...services
  ],
  exports: [
    ...directives,
    ...components,
  ]
})
export class SharedModule { }
