import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { DarkThemeService } from '../../../core';
import { isAppFullWidth$, sharedMenuLinks, LocalizationService } from '../../../shared';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageHeaderComponent implements OnInit {
  @Input() public endSideButtonIcon: string;

  public readonly isFull$ = isAppFullWidth$;
  // const
  public readonly menuLinks = sharedMenuLinks.map(link => ({
    ...link,
    title: this.localizationService.localize(link.title)
  }));

  constructor(private readonly darkTheme: DarkThemeService,
              private readonly localizationService: LocalizationService) { }

  ngOnInit(): void {
  }

  public changeDarkMode(): void {
    this.darkTheme.changeDarkMode();
  }
}
