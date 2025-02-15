import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ScrollbarThemeDirective } from './directives';
import {
  MessagesGroupComponent,
  ChatComponent,
  SharedChatComponent,
  SharedTextareaFooterComponent,
  SharedLoaderComponent,
  SharedUsersListComponent,
  SharedChatActionsComponent,
  SharedInfiniteContentComponent
} from './components';
import { LocalizationPipe } from './localization';
import { PushModule } from '@rx-angular/template/push';
import { IfModule } from '@rx-angular/template/if';
import { LetModule } from '@rx-angular/template/let';
import { ForModule } from '@rx-angular/template/for';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const directives = [
  ScrollbarThemeDirective,
];

const pipes = [
  LocalizationPipe
];

const componentsExport = [
  SharedLoaderComponent,
  SharedTextareaFooterComponent,
  SharedChatComponent,
  SharedUsersListComponent,
  SharedChatActionsComponent,
  SharedInfiniteContentComponent
];

const components = [
  MessagesGroupComponent,
  ChatComponent,
];

const rxAngularModules = [
  PushModule,
  IfModule,
  LetModule,
  ForModule
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    InfiniteScrollModule,
    ...rxAngularModules,
  ],
  declarations: [
    ...directives,
    ...components,
    ...componentsExport,
    ...pipes,
  ],
  providers: [],
  exports: [
    ...directives,
    ...componentsExport,
    ...pipes,
    ...rxAngularModules,
  ]
})
export class SharedModule { }
