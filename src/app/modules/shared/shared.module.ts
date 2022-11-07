import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SharedHeaderComponent } from './components/shared-header/shared-header.component';
import { ScrollbarThemeDirective } from './directives/scrollbar-theme-directive';
import { SharedLoaderComponent } from './components/shared-loader/shared-loader.component';
import { SharedTextareaFooterComponent } from './components/shared-textarea-footer/shared-textarea-footer.component';
import { SharedMessagesGroupComponent } from './components/shared-chat/shared-messages-group/shared-messages-group.component';
import { SharedChatComponent } from './components/shared-chat/shared-chat.component';

const directives = [
  ScrollbarThemeDirective,
];

const componentsExport = [
  SharedHeaderComponent,
  SharedLoaderComponent,
  SharedTextareaFooterComponent,
  SharedChatComponent,
];

const components = [
  SharedMessagesGroupComponent,
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
    ...componentsExport,
  ],
  providers: [],
  exports: [
    ...directives,
    ...componentsExport,
  ]
})
export class SharedModule { }
