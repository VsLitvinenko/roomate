import { Component, Input, OnInit } from '@angular/core';
import {DarkModeService} from '../../services/dark-mode.service';

@Component({
  selector: 'app-shared-header',
  templateUrl: './shared-header.component.html',
  styleUrls: ['./shared-header.component.scss'],
})
export class SharedHeaderComponent implements OnInit {
  @Input() public title: string;

  constructor(private readonly darkMode: DarkModeService) { }

  ngOnInit() {
  }

  changeDarkMode(): void {
    this.darkMode.changeDarkMode();
  }
}
