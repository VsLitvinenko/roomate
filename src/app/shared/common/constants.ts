import {fromEvent, Observable} from 'rxjs';
import {map, shareReplay, startWith} from 'rxjs/operators';
import {LocalisationEnum} from '../localization';

// https://ionicframework.com/docs/api/split-pane
export const splitPaneBreakPoint = {
  size: 'xl',
  minWidth: 1200,
  menuEdgeStart: 140,
};

export interface MenuHeaderLink {
  url: string;
  title: LocalisationEnum;
  icon: string;
}

export const sharedMenuLinks: MenuHeaderLink[] = [
  { url: '/app/channel', title: LocalisationEnum.channels, icon: 'people' },
  { url: '/app/direct', title: LocalisationEnum.directs, icon: 'person' },
  { url: '/app/room', title: LocalisationEnum.room, icon: 'flash' },
];

export const isTouchDevice = window.matchMedia('(any-pointer:coarse)').matches;

export const isAppFullWidth$: Observable<boolean> = fromEvent(window, 'resize')
  .pipe(
    map((event: any) => event.target.innerWidth > splitPaneBreakPoint.minWidth ),
    startWith(window.innerWidth > splitPaneBreakPoint.minWidth),
    shareReplay(1),
  );

