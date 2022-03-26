import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shared-loader',
  templateUrl: './shared-loader.component.html',
  styleUrls: ['./shared-loader.component.scss'],
})
export class SharedLoaderComponent {
  @Input() loading: boolean;
  @Input() background = 'transparent';
  @Input() scale = 1.5;

  constructor() { }

  get spinnerStyle(): any {
    return { transform: `scale(${this.scale})` };
  }
}
