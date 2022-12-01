import { Component, Input, OnInit } from '@angular/core';
import { sharedMenuLinks } from 'src/app/modules/shared/constants';
import { DarkThemeService } from '../../../shared/services/dark-theme.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {
  @Input() isTabsShowing: boolean;
  public readonly menuLinks = sharedMenuLinks;
  constructor(private readonly darkTheme: DarkThemeService) {
  }

  ngOnInit(): void {
  }

  public changeDarkMode(): void {
    this.darkTheme.changeDarkMode();
  }

}
