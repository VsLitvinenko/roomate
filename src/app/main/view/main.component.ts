import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { isAppFullWidth$, splitPaneBreakPoint } from '../../shared/common/constants';
import { MenuControllerService } from '../services/menu-controller.service';

@Component({
  selector: 'app-main',
  templateUrl: 'main.component.html',
  styleUrls: ['main.component.scss'],
})
export class MainComponent {

  public readonly startSideMenuComponent = this.menuController.startSideMenuComponent$;
  public readonly endSideMenuTemplate = this.menuController.endSideMenuTemplate$;

  public readonly splitPaneSize = splitPaneBreakPoint.size;
  public readonly menuEdgeStart = splitPaneBreakPoint.menuEdgeStart;

  public readonly isMobile = isAppFullWidth$.pipe(
    map(value => !value)
  );

  public isTabsShowing = false;

  constructor(private readonly menuController: MenuControllerService) { }

  public toggleMenu(isShown: boolean): void {
    this.isTabsShowing = isShown;
  }

}
