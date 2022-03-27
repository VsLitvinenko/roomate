import { Component, OnInit } from '@angular/core';
import { SharedDarkModeService } from '../../services/shared-dark-mode.service';
import { SharedIsFullWidthService } from '../../services/shared-is-full-width.service';

@Component({
  selector: 'app-shared-header',
  templateUrl: './shared-header.component.html',
  styleUrls: ['./shared-header.component.scss'],
})
export class SharedHeaderComponent implements OnInit {
  public isFull$ = this.appWidthService.isAppFullWidth$;

  constructor(
    private readonly darkMode: SharedDarkModeService,
    private readonly appWidthService: SharedIsFullWidthService,
  ) { }

  ngOnInit() {
  }

  changeDarkMode(): void {
    this.darkMode.changeDarkMode();
  }
}
