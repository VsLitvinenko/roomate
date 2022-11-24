import { Component } from '@angular/core';
import { SharedDarkModeService } from '../modules/shared/services/shared-dark-mode.service';
import { splitPaneBreakPoint } from '../modules/shared/constants';
import { SharedIsFullWidthService } from '../modules/shared/services/shared-is-full-width.service';
import { map } from 'rxjs/operators';
import { MenuControllerService } from './services/menu-controller.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public readonly startSideMenuComponent = this.menuController.startSideMenuComponent$;
  public readonly endSideMenuTemplate = this.menuController.endSideMenuTemplate$;

  public readonly splitPaneSize = splitPaneBreakPoint.size;
  public readonly menuEdgeStart = splitPaneBreakPoint.menuEdgeStart;

  public readonly isMobile = this.appWidthService.isAppFullWidth$.pipe(
    map(value => !value)
  );

  public isTabsShowing = false;

  constructor(
    private readonly darkMode: SharedDarkModeService,
    private readonly appWidthService: SharedIsFullWidthService,
    private readonly menuController: MenuControllerService
  ) { }

  public toggleMenu(isShown: boolean): void {
    this.isTabsShowing = isShown;
  }

}
