import { Injectable } from '@angular/core';
import { JanusJS } from '../janus.types';
import { Janus } from '../janus.constants';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class JanusShareScreenService {

  private roomId: number;
  private screenPlugin: JanusJS.PluginHandle;
  private shareScreenPublisherId$ = new Subject<number>();

  constructor() { }

  public attachPlugin(
    sessionAttach: (options: JanusJS.PluginOptions) => void,
    roomId: number
  ): Observable<number> {
    this.roomId = roomId;
    sessionAttach({
      plugin: 'janus.plugin.videoroom',
      success: pluginHandle => this.screenPluginHandling(pluginHandle),
      error: error => Janus.error('pluginAttaching error:', error),
      onmessage: (message, jsep) => this.onScreenMessage(message, jsep),
      // onlocaltrack: (track, on) => this.onLocalTrack(track),
    });
    return this.shareScreenPublisherId$.asObservable();
  }

  public destroyPlugin(): void {
    this.shareScreenPublisherId$.next(undefined);
    this.screenPlugin.detach({});
  }

  private screenPluginHandling(plugin: JanusJS.PluginHandle): void {
    this.screenPlugin = plugin;
    const request = {
      request: 'join',
      room: this.roomId,
      ptype: 'publisher',
      display: `SCREENtohaloh${Math.random() * 100}`
    };
    this.screenPlugin.send({ message: request });
  }

  private onScreenMessage(msg: JanusJS.Message, jsep: JanusJS.JSEP): void {
    if ((msg as any).videoroom === 'joined') {
      this.onJoinedRoom(msg);
    }
    if (jsep) {
      this.screenPlugin.handleRemoteJsep({ jsep });
    }
  }

  private onJoinedRoom(message: any): void {
    this.shareScreenPublisherId$.next(message.id);
    this.screenPlugin.createOffer({
      tracks: [
        { type: 'audio', capture: true },
        { type: 'screen', capture: true }
      ],
      success: jsep => this.initialConfigure(jsep),
      error: error => Janus.error('WebRTC error:', error),
    });
  }

  private initialConfigure(jsep): void {
    const request = {
      request: 'configure',
      audio: true,
      video: true,
    };
    this.screenPlugin.send({
      message: request,
      jsep
    });
  }
}
