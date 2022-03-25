import {Injectable} from '@angular/core';

const localStorageKey = 'roomate.theme';

@Injectable()
export class DarkModeService {

  private darkMode = this.getStorage();

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
    this.toggleDarkMode(this.darkMode);
  }

  private toggleDarkMode(enable: boolean): void {
    document.body.classList.toggle('dark', enable);
    this.setStorage(enable);
  }

  private setStorage(darkMode: boolean): void {
    localStorage.setItem(localStorageKey, darkMode ? 'dark' : 'light');
  }

  private getStorage(): boolean {
    const storage = localStorage.getItem(localStorageKey);
    return storage ? (storage === 'dark') :
      window?.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
