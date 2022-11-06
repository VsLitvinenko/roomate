import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-shared-textarea-footer',
  templateUrl: './shared-textarea-footer.component.html',
  styleUrls: ['./shared-textarea-footer.component.scss'],
})
export class SharedTextareaFooterComponent implements OnInit {
  @Output() messageSend = new EventEmitter();

  public textMessage: string;

  constructor() { }

  public sendMessage(message: string): void {
    this.messageSend.next(message);
  }

  ngOnInit(): void {
  }

}
