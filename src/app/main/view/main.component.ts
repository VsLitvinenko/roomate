import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { isAppFullWidth$, splitPaneBreakPoint } from '../../shared';
import { ReactiveViewControllerService } from '../services/reactive-view-controller.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: 'main.component.html',
  styleUrls: ['main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent {

  public readonly startSideMenuComponent$ = this.viewController.startSideMenuComponent;
  public readonly endSideMenuTemplate$ = this.viewController.endSideMenuTemplate;
  public readonly headerTemplate$ = this.viewController.headerTemplate;

  // const
  public readonly splitPaneSize = splitPaneBreakPoint.size;
  public readonly menuEdgeStart = splitPaneBreakPoint.menuEdgeStart;

  public readonly isMobile$ = isAppFullWidth$.pipe(
    map(value => !value)
  );

  public readonly isTabsShowing$ = new BehaviorSubject(false);

  constructor(private readonly viewController: ReactiveViewControllerService) { }

}
