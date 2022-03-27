import { Component, Input, OnInit } from '@angular/core';
import { SharedDarkModeService } from '../../services/shared-dark-mode.service';

@Component({
  selector: 'app-shared-header',
  templateUrl: './shared-header.component.html',
  styleUrls: ['./shared-header.component.scss'],
})
export class SharedHeaderComponent implements OnInit {
  @Input() public title: string;

  constructor(private readonly darkMode: SharedDarkModeService) { }

  ngOnInit() {
  }

  changeDarkMode(): void {
    this.darkMode.changeDarkMode();
  }
}
