import { Directive, Host, Input, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { fromEvent, mergeWith, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { isTouchDevice } from '../constants';

const defaultStyle = `
  ::-webkit-scrollbar {
    width: 4px;
  }
  ::-webkit-scrollbar-track {
    background: none;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 1rem;
    border: none;
  }
`;

const visibleStyle = `
  ::-webkit-scrollbar-thumb {
    background: var(--roomate-color-green);
  }
`;

const invisibleStyle = `
  ::-webkit-scrollbar-thumb {
    background: none;
  }
`;

@UntilDestroy()
@Directive({
  selector: '[appScrollbarTheme]'
})
export class ScrollbarThemeDirective implements OnInit {
  @Input() scrollAlwaysVisible = false;
  private barStyle: HTMLStyleElement;

  constructor(@Host() private readonly content: IonContent) {
  }

  ngOnInit(): void {
    this.barStyle = document.createElement('style');
    (this.content as any).el.shadowRoot.appendChild(this.barStyle);
    this.toggleStyle(this.scrollAlwaysVisible);

    if (!this.scrollAlwaysVisible) {
      setTimeout(() => this.mouseEvents(), 100);
    }
  }

  private mouseEvents(): void {
    let show$: Observable<unknown>;
    let hide$: Observable<unknown>;
    if (isTouchDevice) {
      this.content.scrollEvents = true;
      show$ = this.content.ionScrollStart;
      hide$ = this.content.ionScrollEnd;
    }
    else {
      const scrollArea = [
        ...(this.content as any).el.shadowRoot.children
      ].find(
        item => item.className === 'inner-scroll scroll-y'
      );
      show$ = fromEvent(scrollArea, 'mouseenter');
      hide$ = fromEvent(scrollArea, 'mouseleave');
    }
    show$.pipe(
      map(() => true),
      mergeWith(
        hide$.pipe(
          map(() => false)
        )
      ),
      untilDestroyed(this)
    ).subscribe(value => this.toggleStyle(value));
  }

  private toggleStyle(visible: boolean): void {
    this.barStyle.innerText = defaultStyle + (visible ? visibleStyle : invisibleStyle);
  }
}
