import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedDarkModeService } from './services/shared-dark-mode.service';
import { SharedHeaderComponent } from './components/shared-header/shared-header.component';
import { IonicModule } from '@ionic/angular';
import { ScrollbarThemeDirective } from './directives/scrollbar-theme-directive';
import { SharedProfileSideComponent } from './components/shared-profile-side/shared-profile-side.component';
import { SharedLoaderComponent } from './components/shared-loader/shared-loader.component';
import { SharedIsFullWidthService } from './services/shared-is-full-width.service';
import { RouterModule } from '@angular/router';

const directives = [
  ScrollbarThemeDirective,
];

const components = [
  SharedHeaderComponent,
  SharedProfileSideComponent,
  SharedLoaderComponent,
];

const services = [
  SharedDarkModeService,
  SharedIsFullWidthService,
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
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
