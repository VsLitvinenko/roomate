import { Component, Input, OnInit } from '@angular/core';
import { sharedMenuLinks } from 'src/app/modules/shared/constants';
import { SharedDarkModeService } from '../../../modules/shared/services/shared-dark-mode.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {
  @Input() isTabsShowing: boolean;
  public readonly menuLinks = sharedMenuLinks;
  constructor(private readonly darkMode: SharedDarkModeService) {
  }

  ngOnInit(): void {
  }

  public changeDarkMode(): void {
    this.darkMode.changeDarkMode();
  }

}
