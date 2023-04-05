import { animate, style, transition, trigger } from '@angular/animations';

export const fadeAnimation = (ms: number) => trigger('fade', [
  transition('void => *', [
    style({ opacity: 0 }), animate(ms)
  ])
]);
