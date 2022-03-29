import { Component, Input, OnInit } from '@angular/core';
import { sharedMenuLinks } from 'src/app/modules/shared/constants';
import { SharedDarkModeService } from '../../../modules/shared/services/shared-dark-mode.service';
import { Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {
  @Input() isMenuShown$: Observable<boolean>;
  public readonly menuLinks = sharedMenuLinks;
  public isTabsShowing: boolean;

  constructor(private readonly darkMode: SharedDarkModeService) {
  }

  ngOnInit(): void {
    this.isMenuShown$
      .pipe(untilDestroyed(this))
      .subscribe(value => this.isTabsShowing = value);
  }

  public changeDarkMode(): void {
    this.darkMode.changeDarkMode();
  }

}
