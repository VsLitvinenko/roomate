import { Component, Input, OnInit } from '@angular/core';
import { MenuHeaderLink, sharedMenuLinks } from 'src/app/modules/shared/constants';
import { Router } from '@angular/router';
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

  constructor(
    private readonly darkMode: SharedDarkModeService,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this.isMenuShown$
      .pipe(untilDestroyed(this))
      .subscribe(value => this.isTabsShowing = value);

    const currentPath = window.location.pathname.slice(1);
    this.menuLinks.forEach(
      link => link.active = currentPath.includes(link.module)
    );
  }

  public changeDarkMode(): void {
    this.darkMode.changeDarkMode();
  }

  public moduleNavigate(link: MenuHeaderLink): void {
    if (!link.active) {
      this.router.navigate([link.module])
        .then(() =>
          this.router.navigate(
            ['', { outlets: { content: [link.module] } }]
          )
        ).then(() => {
        this.menuLinks.forEach(item => item.active = false);
        link.active = true;
      });
    }
  }

}
