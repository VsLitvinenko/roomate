import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { DarkThemeService } from '../../../core';
import { isAppFullWidth$, sharedMenuLinks } from '../../common';

@Component({
  selector: 'app-shared-header',
  templateUrl: './shared-header.component.html',
  styleUrls: ['./shared-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedHeaderComponent implements OnInit {
  @Input() endSideButtonIcon: string;

  public isFull$ = isAppFullWidth$;
  public readonly menuLinks = sharedMenuLinks;

  constructor(
    private readonly darkTheme: DarkThemeService,
  ) { }

  ngOnInit(): void {
  }

  public changeDarkMode(): void {
    this.darkTheme.changeDarkMode();
  }
}
