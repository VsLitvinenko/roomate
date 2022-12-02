import { Component } from '@angular/core';
import { DarkThemeService } from './core';

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
