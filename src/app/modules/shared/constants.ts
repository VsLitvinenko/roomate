// https://ionicframework.com/docs/api/split-pane
export const splitPaneBreakPoint = {
  size: 'xl',
  minWidth: 1200,
  menuEdgeStart: 125,
};

export interface MenuHeaderLink {
  url: string;
  title: string;
  icon: string;
}

export const sharedMenuLinks: MenuHeaderLink[] = [
  { url: '/channel', title: 'channel', icon: 'people' },
  { url: '/direct', title: 'direct', icon: 'person' },
  { url: '/room', title: 'room', icon: 'flash' },
];

