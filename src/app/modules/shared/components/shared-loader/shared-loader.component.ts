import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shared-loader',
  templateUrl: './shared-loader.component.html',
  styleUrls: ['./shared-loader.component.scss'],
})
export class SharedLoaderComponent {
  @Input() loading: boolean;
  @Input() background = 'transparent';

  constructor() { }
}
