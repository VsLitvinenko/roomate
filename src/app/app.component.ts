import { Component } from '@angular/core';
import {DarkModeService} from './modules/shared/services/dark-mode.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private readonly darkMode: DarkModeService) {}
}
