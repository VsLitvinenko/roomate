import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ScrollbarThemeDirective } from './directives';
import {
  SharedHeaderComponent,
  SharedChatComponent,
  SharedTextareaFooterComponent,
  SharedLoaderComponent,
  SharedMessagesGroupComponent,
  SharedUsersListComponent,
  SharedChatActionsComponent
} from './components';

const directives = [
  ScrollbarThemeDirective,
];

const componentsExport = [
  SharedHeaderComponent,
  SharedLoaderComponent,
  SharedTextareaFooterComponent,
  SharedChatComponent,
  SharedUsersListComponent,
  SharedChatActionsComponent
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
