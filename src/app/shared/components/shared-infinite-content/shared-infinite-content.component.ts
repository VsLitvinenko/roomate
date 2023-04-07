import {
  Component,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { IonContent } from '@ionic/angular';
import { BehaviorSubject, filter, firstValueFrom, lastValueFrom, Subject, take } from 'rxjs';
import { IInfiniteScrollEvent } from 'ngx-infinite-scroll/models';

export type InfiniteScrollSide = 'top' | 'bottom';
export interface InfiniteScrollEvent {
  resolve: (value?: unknown) => void;
  reject: (value?: unknown) => void;
  side: InfiniteScrollSide;
}

@Component({
  selector: 'app-shared-infinite-content',
  templateUrl: './shared-infinite-content.component.html',
  styleUrls: ['./shared-infinite-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SharedInfiniteContentComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() public topInfinite = false;
  @Input() public bottomInfinite = false;
  @Input() public loading = false;
  @Input() public scrollEvents = false;
  @Input() public mutationContainer: HTMLElement | any;

  @Output() public readonly infiniteScroll = new EventEmitter<InfiniteScrollEvent>();
  @Output() public readonly ionScroll = new EventEmitter<CustomEvent>();

  @ViewChild(IonContent) public readonly content: IonContent;
  public readonly topScrollLoading$ = new BehaviorSubject<boolean>(false);
  public readonly bottomScrollLoading$ = new BehaviorSubject<boolean>(false);

  private readonly mutations$ = new Subject<void>();
  private mutationsObserver: MutationObserver;

  private readonly scrollContent = new BehaviorSubject<HTMLElement>(null);
  // eslint-disable-next-line @typescript-eslint/member-ordering
  @Output() public readonly scrollElementReady = this.scrollContent.pipe(
    filter(el => el !== null),
    take(1)
  );

  constructor() { }

  public get scrollElement(): HTMLElement {
    return this.scrollContent.value;
  }

  public get scrollElementAsync(): Promise<HTMLElement> {
    return firstValueFrom(this.scrollElementReady);
  }

  public scrollToBottom(duration?: number): Promise<void> {
    return this.content.scrollToBottom(duration);
  }

  public scrollToPoint(y: number, duration?: number): Promise<void> {
    return this.content.scrollToPoint(null, y, duration);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.mutationContainer && this.mutationContainer) {
      // const callback = (mutationsList: MutationRecord[]) => {
      //   console.log(mutationsList, 'MUTATIONS LIST');
      //   this.mutations$.next(void 0);
      // };
      this.mutationsObserver = new MutationObserver(() => this.mutations$.next(void 0));
      this.mutationsObserver.observe(this.mutationContainer, {
        childList: true,
        subtree: true
      });
    }
  }

  ngOnDestroy(): void {
    if (this.mutationsObserver) {
      this.mutationsObserver.disconnect();
    }
  }

  ngAfterViewInit(): void {
    this.content.getScrollElement().then(el => this.scrollContent.next(el));
  }

  public onBottomScroll(): void {
    if (!this.bottomInfinite || this.bottomScrollLoading$.value) {
      return;
    }

    this.bottomScrollLoading$.next(true);
    this.onInfiniteScroll('bottom')
      .then(() => this.bottomScrollLoading$.next(false));
  }

  public onTopScroll(event: IInfiniteScrollEvent): void {
    if (!this.topInfinite || this.topScrollLoading$.value) {
      return;
    }

    const handle = (bottomPosition: number) => lastValueFrom(
      this.mutations$.pipe(take(1))
    ).then(() => {
      // 44px is spinner container height
      const newTopPosition = this.scrollElement.scrollHeight - bottomPosition - 44;
      return this.scrollToPoint(newTopPosition, 0);
    });

    this.topScrollLoading$.next(true);
    this.onInfiniteScroll('top')
      .then(() => handle(this.scrollElement.scrollHeight - event.currentScrollPosition))
      .then(() => this.topScrollLoading$.next(false));
  }

  private onInfiniteScroll(side: InfiniteScrollSide): Promise<unknown> {
    return new Promise(
      (resolve, reject) => this.infiniteScroll.emit({resolve, reject, side})
    );
  }

}
