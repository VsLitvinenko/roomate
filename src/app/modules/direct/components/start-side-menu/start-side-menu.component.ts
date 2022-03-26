import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { usersList } from './data-source';
import { splitPaneBreakPoint } from '../../../shared/constants';

@Component({
  selector: 'app-start-side-menu',
  templateUrl: './start-side-menu.component.html',
  styleUrls: ['./start-side-menu.component.scss'],
})
export class StartSideMenuComponent implements OnInit {

  public userList = usersList;
  public msgMaxWidth: number;

  constructor(private readonly router: Router) { }

  @HostListener('window:resize', ['$event'])
  onAppResize(event: any = null): void {
    const appWidth = event === null ? window.innerWidth : event.target.innerWidth;
    // pc menu max width = 348 - x = 242; x = 106 (with overflow)
    // so mobile menu max width = 304 - 106 = 198
    this.msgMaxWidth = appWidth > splitPaneBreakPoint.minWidth ? 242 : 198;
  }

  ngOnInit(): void {
    this.onAppResize();
  }

  public openCurrentDirect(id: string) {
    this.router.navigate(['direct', 'current', id]).then();
  }
}
