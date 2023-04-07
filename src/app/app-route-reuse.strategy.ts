import { ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
import { IonicRouteStrategy } from '@ionic/angular';
import { ComponentRef } from '@angular/core';
import { ReusableComponent } from './shared';

export interface ReuseRouteData {
  reuse: boolean;
  module: 'channel' | 'direct';
}

export class AppRouteReuseStrategy extends IonicRouteStrategy {

  private readonly storedRoutes: { [k: string]: Map<string, DetachedRouteHandle> } = {
    channel: new Map<string, DetachedRouteHandle>(),
    direct: new Map<string, DetachedRouteHandle>()
  };

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return route.data.reuse || super.shouldDetach(route);
  }

  store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
    if (!route.data.reuse) {
      super.store(route, detachedTree);
      return;
    }
    this.storedRoutes[route.data.module].set(route.params.id, detachedTree);
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return route.data.reuse ?
      this.storedRoutes[route.data.module].has(route.params.id) :
      super.shouldAttach(route);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (route.data.reuse) {
      const stored = this.storedRoutes[route.data.module].get(route.params.id);
      const componentRef: ComponentRef<ReusableComponent> = (stored as any).componentRef;
      componentRef.instance.triggerReuse();
      return stored;
    }
    else {
      return super.retrieve(route);
    }
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return super.shouldReuseRoute(future, curr);
  }
}
