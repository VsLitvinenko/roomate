import { Component } from '@angular/core';
import { SharedDarkModeService } from '../modules/shared/services/shared-dark-mode.service';
import { splitPaneBreakPoint } from '../modules/shared/constants';
import { SharedIsFullWidthService } from '../modules/shared/services/shared-is-full-width.service';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MenuControllerService } from './services/menu-controller.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public startSideMenuComponent = this.menuController.startSideMenuComponent$;
  public endSideMenuTemplate = this.menuController.endSideMenuTemplate$;

  public readonly splitPaneSize = splitPaneBreakPoint.size;
  public readonly menuEdgeStart = 125;

  public readonly isMobile$ = this.appWidthService.isAppFullWidth$.pipe(
    map(value => !value)
  );

  public readonly isMenuShown$ = new Subject<boolean>();

  constructor(
    private readonly darkMode: SharedDarkModeService,
    private readonly appWidthService: SharedIsFullWidthService,
    private readonly menuController: MenuControllerService
  ) {}

}
