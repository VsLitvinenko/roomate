import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-shared-loader',
  templateUrl: './shared-loader.component.html',
  styleUrls: ['./shared-loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedLoaderComponent {
  @Input() public loading: boolean;
  @Input() public background = 'transparent';
  @Input() public scale = 1.5;

  constructor() { }

  public get spinnerStyle(): any {
    return { transform: `scale(${this.scale})` };
  }

  public stopPointEvent(event: Event): void {
    event.stopImmediatePropagation();
  }
}
