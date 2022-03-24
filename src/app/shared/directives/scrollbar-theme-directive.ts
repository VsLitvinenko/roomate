import {Directive, ElementRef, OnInit} from '@angular/core';

const stylesheet = `
  ::-webkit-scrollbar {
    width: 3px;
  }
  ::-webkit-scrollbar-track {
    background: none;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 1rem;
    background: var(--roomate-color-green);
    border: none;
  }
  ::-webkit-scrollbar-thumb:hover {
  }
`;

@Directive({
  selector: '[appScrollbarTheme]'
})
export class ScrollbarThemeDirective implements OnInit {
  constructor(private readonly el: ElementRef) {
  }

  ngOnInit() {
    const styleElmt = this.el.nativeElement.shadowRoot.querySelector('style');

    if (styleElmt) {
      styleElmt.append(stylesheet);
    }
    else {
      const barStyle = document.createElement('style');
      barStyle.append(stylesheet);
      this.el.nativeElement.shadowRoot.appendChild(barStyle);
    }
  }
}
