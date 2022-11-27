import { Component, OnInit } from '@angular/core';
import { usersList } from './data-source';
import { IsFullWidthService } from '../../../../shared/services/is-full-width.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-direct-start-side',
  templateUrl: './direct-start-side.component.html',
  styleUrls: ['./direct-start-side.component.scss'],
})
export class DirectStartSideComponent implements OnInit {

  public userList = usersList;
  public msgMaxWidth: number;

  constructor(private readonly appWidthService: IsFullWidthService) { }

  ngOnInit(): void {
    // pc menu max width = 348 - x = 242; x = 106 (with overflow)
    // so mobile menu max width = 304 - 106 = 198
    this.appWidthService.isAppFullWidth$.pipe(
      untilDestroyed(this)
    ).subscribe(full => this.msgMaxWidth = full ? 242 : 198);
  }
}
