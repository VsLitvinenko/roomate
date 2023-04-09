import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { isAppFullWidth$, splitPaneBreakPoint } from '../../shared';
import { ReactiveViewControllerService } from '../services/reactive-view-controller.service';
import { BehaviorSubject } from 'rxjs';
import { InjectorService } from '../../core';

@Component({
  selector: 'app-main',
  templateUrl: 'main.component.html',
  styleUrls: ['main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent {

  public readonly headerTemplate$ = this.viewController.headerTemplate;
  public readonly startSideMenuComponent$ = this.viewController.startSideMenuComponent;
  public readonly endSideMenuTemplate$ = this.viewController.endSideMenuTemplate.pipe(
    map(template => template?.withValue ? {
        component: template.component,
        injector: this.inj.createInjector<BehaviorSubject<any>>(template.withValue)
      } : null)
  );

  // const
  public readonly splitPaneSize = splitPaneBreakPoint.size;
  public readonly menuEdgeStart = splitPaneBreakPoint.menuEdgeStart;

  public readonly isMobile$ = isAppFullWidth$.pipe(
    map(value => !value)
  );

  public readonly isTabsShowing$ = new BehaviorSubject(false);

  constructor(private readonly viewController: ReactiveViewControllerService,
              private readonly inj: InjectorService) { }

}
