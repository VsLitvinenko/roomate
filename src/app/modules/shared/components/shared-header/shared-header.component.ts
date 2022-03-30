import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { SharedDarkModeService } from '../../services/shared-dark-mode.service';
import { SharedIsFullWidthService } from '../../services/shared-is-full-width.service';
import { sharedMenuLinks } from '../../constants';

@Component({
  selector: 'app-shared-header',
  templateUrl: './shared-header.component.html',
  styleUrls: ['./shared-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedHeaderComponent implements OnInit {
  @Input() endSideButtonIcon: string;

  public isFull$ = this.appWidthService.isAppFullWidth$;
  public readonly menuLinks = sharedMenuLinks;

  constructor(
    private readonly darkMode: SharedDarkModeService,
    private readonly appWidthService: SharedIsFullWidthService,
  ) { }

  ngOnInit() {
  }

  public changeDarkMode(): void {
    this.darkMode.changeDarkMode();
  }
}
