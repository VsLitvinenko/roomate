import { Component, Input, OnInit } from '@angular/core';
import {DarkModeService} from '../../../../../../shared/services/dark-mode.service';

@Component({
  selector: 'app-channel-header',
  templateUrl: './channel-header.component.html',
  styleUrls: ['./channel-header.component.scss'],
})
export class ChannelHeaderComponent implements OnInit {
  @Input() public title: string;

  constructor(private readonly darkMode: DarkModeService) { }

  ngOnInit() {
  }

  changeDarkMode(): void {
    this.darkMode.changeDarkMode();
  }
}
