import { Directive, Host, Input, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { fromEvent, mergeWith, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

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
    const isMobile = window.matchMedia('(any-pointer:coarse)').matches;

    let show$: Observable<boolean>;
    let hide$: Observable<boolean>;
    if (isMobile) {
      this.content.scrollEvents = true;
      show$ = this.content.ionScrollStart.pipe(
        map(() => true)
      );
      hide$ = this.content.ionScrollEnd.pipe(
        map(() => false)
      );
    }
    else {
      const scrollArea = [
        ...(this.content as any).el.shadowRoot.children
      ].find(
        item => item.className === 'inner-scroll scroll-y'
      );
      show$ = fromEvent(scrollArea, 'mouseenter').pipe(
        map(() => true)
      );
      hide$ = fromEvent(scrollArea, 'mouseleave').pipe(
        map(() => false)
      );
    }
    show$.pipe(
      mergeWith(hide$),
      untilDestroyed(this)
    ).subscribe(value => this.toggleStyle(value));
  }

  private toggleStyle(visible: boolean): void {
    this.barStyle.innerText = defaultStyle + (visible ? visibleStyle : invisibleStyle);
  }
}
