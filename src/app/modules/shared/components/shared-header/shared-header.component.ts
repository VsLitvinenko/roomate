import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SharedDarkModeService } from '../../services/shared-dark-mode.service';
import { SharedIsFullWidthService } from '../../services/shared-is-full-width.service';
import { Router } from '@angular/router';
import { MenuHeaderLink, sharedMenuLinks } from '../../constants';

@Component({
  selector: 'app-shared-header',
  templateUrl: './shared-header.component.html',
  styleUrls: ['./shared-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedHeaderComponent implements OnInit {
  public isFull$ = this.appWidthService.isAppFullWidth$;

  public readonly menuLinks = sharedMenuLinks;

  constructor(
    private readonly darkMode: SharedDarkModeService,
    private readonly appWidthService: SharedIsFullWidthService,
    private readonly router: Router,
  ) { }

  ngOnInit() {
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
