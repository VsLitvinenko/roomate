import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DarkModeService} from './services/dark-mode.service';

@NgModule({
  declarations: [],
  providers: [
    DarkModeService
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
