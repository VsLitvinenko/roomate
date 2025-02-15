import { Component, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { testMessages, userData } from './data-source';
import { IonContent } from '@ionic/angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ReactiveViewControllerService } from '../../../../services/reactive-view-controller.service';
import { DirectEndSideComponent } from '../../components';
import { isAppFullWidth$ } from 'src/app/shared/common/constants';

@UntilDestroy()
@Component({
  selector: 'app-current-direct',
  templateUrl: './current-direct.component.html',
  styleUrls: ['./current-direct.component.scss'],
})
export class CurrentDirectComponent implements OnInit {
  @ViewChild('currentChatContent')
  private readonly chatContent: IonContent;

  public readonly isFull$ = isAppFullWidth$;

  public directId: string;
  public dataSource = [];
  public currentUser = userData;

  private loadingCounter = 0;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly viewController: ReactiveViewControllerService,
  ) { }

  get loading(): boolean {
    return this.loadingCounter !== 0;
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      untilDestroyed(this)
    ).subscribe(params => {
      this.directId = params.id;
      this.updateEndSideMenu(this.directId);

      this.dataSource = [];
      this.loadingCounter += 1;
      this.loadingData()
        .then(() => this.chatContent.scrollToBottom(0))
        .then(() => this.loadingCounter -= 1);
    });
  }

  public infiniteScroll(event: any): void {
    this.loadingData()
      .then(() => event.target.complete());
  }

  public messageSend(event: string): void {
    alert(event);
  }

  private loadingData(): Promise<void> {
    return new Promise<void>(resolve =>
      setTimeout(() => {
        this.dataSource.push(...testMessages);
        resolve();
      }, 1000)
    );
  }

  private updateEndSideMenu(id: string): void {
    this.viewController.setEndSideMenuTemplate(DirectEndSideComponent, id);
  }
}
