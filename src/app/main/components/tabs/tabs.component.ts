import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { LocalizationService, sharedMenuLinks } from 'src/app/shared';
import { DarkThemeService } from '../../../core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsComponent implements OnInit {
  @Input() isTabsShowing: boolean;

  // const
  public readonly menuLinks = sharedMenuLinks.map(link => ({
    ...link,
    title: this.localizationService.localize(link.title)
  }));
  constructor(private readonly darkTheme: DarkThemeService,
              private readonly localizationService: LocalizationService) {
  }

  ngOnInit(): void {
  }

  public changeDarkMode(): void {
    this.darkTheme.changeDarkMode();
  }

}
