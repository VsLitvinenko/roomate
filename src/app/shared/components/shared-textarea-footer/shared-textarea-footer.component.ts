import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { IonTextarea } from '@ionic/angular';

@Component({
  selector: 'app-shared-textarea-footer',
  templateUrl: './shared-textarea-footer.component.html',
  styleUrls: ['./shared-textarea-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedTextareaFooterComponent {
  @Output() public messageSend = new EventEmitter();

  constructor() { }

  public sendMessage(textarea: IonTextarea): void {
    const message = textarea.value.trimEnd().trimStart();
    if (message) {
      this.messageSend.next(message);
      textarea.value = '';
    }
  }

}
