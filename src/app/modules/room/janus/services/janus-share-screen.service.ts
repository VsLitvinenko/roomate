import { Injectable } from '@angular/core';
import { JanusJS } from '../janus.types';
import { Janus } from '../janus.constants';

@Injectable()
export class JanusShareScreenService {

  private roomId: number;
  private screenPlugin: JanusJS.PluginHandle;

  constructor() { }

  public attachPlugin(
    sessionAttach: (options: JanusJS.PluginOptions) => void,
    roomId: number
  ): void {
    this.roomId = roomId;
    sessionAttach({
      plugin: 'janus.plugin.videoroom',
      success: pluginHandle => this.screenPluginHandling(pluginHandle),
      error: error => Janus.error('pluginAttaching error:', error),
      onmessage: (message, jsep) => this.onScreenMessage(message, jsep),
      // onlocaltrack: (track, on) => this.onLocalTrack(track),
    });
  }

  public destroyPlugin(): void {
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
      this.onJoinedRoom();
    }
    if (jsep) {
      this.screenPlugin.handleRemoteJsep({ jsep });
    }
  }

  private onJoinedRoom(): void {
    this.screenPlugin.createOffer({
      media: { video: 'screen', audioSend: true, videoRecv: false},
      success: jsep => this.initialConfigure(jsep),
      error: error => Janus.error('WebRTC error:', error),
    });
  }

  private initialConfigure(jsep): void {
    const request = {
      request: 'configure',
      audio: false,
      video: true,
    };
    this.screenPlugin.send({
      message: request,
      jsep
    });
  }
}
