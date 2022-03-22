import {Injectable} from '@angular/core';

@Injectable()
export class DarkModeService {

  private darkMode = window?.matchMedia('(prefers-color-scheme: dark)').matches;

  constructor() {
    this.toggleDarkMode(this.darkMode);

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    prefersDark.addEventListener('change', e => {
      if (this.darkMode !== e.matches) {
        this.darkMode = !this.darkMode;
        this.toggleDarkMode(this.darkMode);
      }
    });
  }

  public changeDarkMode(): void {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('dark', this.darkMode);
  }

  private toggleDarkMode(enable): void {
    document.body.classList.toggle('dark', enable);
  }
}
