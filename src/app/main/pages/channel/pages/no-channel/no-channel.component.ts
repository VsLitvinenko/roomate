import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveViewControllerService } from '../../../../services/reactive-view-controller.service';
import { CreateChannelModalService } from '../../components';

@Component({
  selector: 'app-no-chat',
  templateUrl: './no-channel.component.html',
  styleUrls: ['./no-channel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoChannelComponent implements OnInit {

  constructor(private readonly viewController: ReactiveViewControllerService,
              private readonly createModalService: CreateChannelModalService) { }

  ngOnInit(): void {
    this.viewController.clearHeaderTemplate();
    this.viewController.clearEndSideMenuTemplate();
  }

  public async openCreateChannelModal(): Promise<void> {
    await this.createModalService.openModal();
  }

}
