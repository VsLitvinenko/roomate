import { Injectable } from '@angular/core';
import { JanusJS } from '../janus.types';
import { doSimulcast, Janus } from '../janus.constants';
import { BehaviorSubject } from 'rxjs';

interface ScreenSharedEvent {
  id: number;
  sharingCanceled: Promise<void>;
}

@Injectable()
export class JanusShareScreenService {
  public localScreenPublisher$$ = new BehaviorSubject<JanusJS.PublisherTracks>(null);

  private roomId: number;
  private screenPlugin: JanusJS.PluginHandle;

  // init in attachPlugin(), resolve in onJoinedRoom()
  private resolveJoinedRoomPromise: (event: ScreenSharedEvent) => void;
  // init in onJoinedRoom(), resolve in destroyPlugin()
  private resolveSharingCanceledPromise: () => void;

  constructor() { }

  public async attachPlugin(
    sessionAttach: (options: JanusJS.PluginOptions) => void,
    roomId: number
  ): Promise<ScreenSharedEvent> {
    this.roomId = roomId;
    sessionAttach({
      plugin: 'janus.plugin.videoroom',
      success: pluginHandle => this.screenPluginHandling(pluginHandle),
      error: error => Janus.error('pluginAttaching error:', error),
      onmessage: (message, jsep) => this.onScreenMessage(message, jsep),
      onlocaltrack: (track, on) => this.onLocalTrack(track, on),
    });
    return new Promise(resolve => this.resolveJoinedRoomPromise = resolve);
  }

  public destroyPlugin(): void {
    this.localScreenPublisher$$.next(null);
    this.resolveSharingCanceledPromise();
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
    const sharingCanceled = new Promise<void>(
      resolve => this.resolveSharingCanceledPromise = resolve
    );
    this.resolveJoinedRoomPromise({
      id: message.id,
      sharingCanceled
    });

    this.screenPlugin.createOffer({
      tracks: [
        { type: 'screen', capture: true, simulcast: doSimulcast }
      ],
      success: jsep => this.initialConfigure(jsep),
      error: error => {
        Janus.error('WebRTC error:', error);
        this.destroyPlugin();
      },
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

  private onLocalTrack(track: MediaStreamTrack, on: boolean): void {
    if (on) {
      this.localScreenPublisher$$.next({
        display: 'Your screen sharing',
        video: track,
        audio: null
      });
    }
    else {
      this.destroyPlugin();
    }
  }
}
