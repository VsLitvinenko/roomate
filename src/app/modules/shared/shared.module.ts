import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SharedDarkModeService } from './services/shared-dark-mode.service';
import { SharedHeaderComponent } from './components/shared-header/shared-header.component';
import { ScrollbarThemeDirective } from './directives/scrollbar-theme-directive';
import { SharedLoaderComponent } from './components/shared-loader/shared-loader.component';
import { SharedIsFullWidthService } from './services/shared-is-full-width.service';
import { SharedTextareaFooterComponent } from './components/shared-textarea-footer/shared-textarea-footer.component';

const directives = [
  ScrollbarThemeDirective,
];

const components = [
  SharedHeaderComponent,
  SharedLoaderComponent,
  SharedTextareaFooterComponent,
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
