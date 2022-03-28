// https://ionicframework.com/docs/api/split-pane
export const splitPaneBreakPoint = {
  size: 'xl',
  minWidth: 1200
};

export interface MenuHeaderLink {
  module: string;
  title: string;
  icon: string;
  active?: boolean;
}

export const sharedMenuLinks: MenuHeaderLink[] = [
  { module: 'channel', title: 'channel', icon: 'people' },
  { module: 'direct', title: 'direct', icon: 'person' },
];

