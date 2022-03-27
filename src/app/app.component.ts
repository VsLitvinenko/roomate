import { Component } from '@angular/core';
import { SharedDarkModeService } from './modules/shared/services/shared-dark-mode.service';
import { splitPaneBreakPoint } from './modules/shared/constants';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public readonly splitPaneSize = splitPaneBreakPoint.size;

  constructor(private readonly darkMode: SharedDarkModeService) {}

}
