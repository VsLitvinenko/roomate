import { Component } from '@angular/core';
import { DarkThemeService } from '../modules/shared/services/dark-theme.service';
import { isAppFullWidth$, splitPaneBreakPoint } from '../modules/shared/constants';
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

  public readonly isMobile = isAppFullWidth$.pipe(
    map(value => !value)
  );

  public isTabsShowing = false;

  constructor(
    private readonly darkTheme: DarkThemeService,
    private readonly menuController: MenuControllerService
  ) { }

  public toggleMenu(isShown: boolean): void {
    this.isTabsShowing = isShown;
  }

}
