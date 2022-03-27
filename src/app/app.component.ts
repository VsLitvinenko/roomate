import { Component } from '@angular/core';
import { SharedDarkModeService } from './modules/shared/services/shared-dark-mode.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private readonly darkMode: SharedDarkModeService) {}
}
