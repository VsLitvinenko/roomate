import { Injectable } from '@angular/core';

@Injectable()
export class InjectableDataClass {
  public channelId: string;

  constructor(channelId: string) {
    this.channelId = channelId;
  }
}
