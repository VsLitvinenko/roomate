import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { usersList } from './data-source';
import { SharedIsFullWidthService } from '../../../shared/services/shared-is-full-width.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-start-side-menu',
  templateUrl: './start-side-menu.component.html',
  styleUrls: ['./start-side-menu.component.scss'],
})
export class StartSideMenuComponent implements OnInit {

  public userList = usersList;
  public msgMaxWidth: number;

  constructor(
    private readonly router: Router,
    private readonly appWidthService: SharedIsFullWidthService,
  ) { }

  ngOnInit(): void {
    this.appWidthService.isAppFullWidth$
      .pipe(untilDestroyed(this))
      // pc menu max width = 348 - x = 242; x = 106 (with overflow)
      // so mobile menu max width = 304 - 106 = 198
      .subscribe(full => this.msgMaxWidth = full ? 242 : 198);
  }

  public openCurrentDirect(id: string) {
    this.router.navigate(['direct', 'current', id]).then();
  }
}
