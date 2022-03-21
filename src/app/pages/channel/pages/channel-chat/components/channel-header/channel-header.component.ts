import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-channel-header',
  templateUrl: './channel-header.component.html',
  styleUrls: ['./channel-header.component.scss'],
})
export class ChannelHeaderComponent implements OnInit {
  @Input() public title: string;
  private darkMode = window?.matchMedia('(prefers-color-scheme: dark)').matches;

  constructor() { }

  ngOnInit() {
    this.toggleDarkMode(this.darkMode);
    this.initPrefersDark();
  }

  public changeDarkMode(): void {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark', this.darkMode);
  }

  private initPrefersDark(): void {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    prefersDark.addEventListener('change', e => {
      if (this.darkMode !== e.matches) {
        this.darkMode = !this.darkMode;
        this.toggleDarkMode(this.darkMode);
      }
    });
  }

  private toggleDarkMode(enable): void {
    document.body.classList.toggle('dark', enable);
  }

}
