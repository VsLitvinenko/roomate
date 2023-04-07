import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MenuControllerService } from '../../../../services/menu-controller.service';
import { CreateChannelModalService } from '../../components';

@Component({
  selector: 'app-no-chat',
  templateUrl: './no-channel.component.html',
  styleUrls: ['./no-channel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoChannelComponent implements OnInit {

  constructor(private readonly menuController: MenuControllerService,
              private readonly createModalService: CreateChannelModalService) { }

  ngOnInit(): void {
    this.menuController.clearHeaderTemplate();
    this.menuController.clearEndSideMenuTemplate();
  }

  public async openCreateChannelModal(): Promise<void> {
    await this.createModalService.openModal();
  }

}
