import { Component } from '@angular/core';
import { DarkThemeService } from './modules/shared/services/dark-theme.service';

@Component({
  selector: 'app-root',
  template: `
    <ion-app>
      <ion-router-outlet animated="false"></ion-router-outlet>
    </ion-app>
  `
})
export class AppComponent {

  constructor(private readonly darkTheme: DarkThemeService) { }

}
