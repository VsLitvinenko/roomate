import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-start-side-menu',
  templateUrl: './start-side-menu.component.html',
  styleUrls: ['./start-side-menu.component.scss'],
})
export class StartSideMenuComponent implements OnInit {

  publicChannels = [
    { title: 'public 1', id: 1, unread: false, active: true },
    { title: 'public 2', id: 2, unread: true, active: false },
    { title: 'public 3', id: 3, unread: false, active: false },
  ];
  privateChannels = [
    { title: 'private 1', id: 1, unread: false },
    { title: 'private 2', id: 2, unread: false },
    { title: 'private 3', id: 3, unread: true },
    { title: 'private 4', id: 4, unread: true },
  ];

  constructor(private readonly router: Router) { }

  ngOnInit() {
  }

  public openCurrentChannel(id: string) {
    this.router.navigate(['channel', 'current', id]).then();
  }

  public channelNgStyle(item): string {
    return `${item.unread ? 'unread' : 'read'} ${item.active ? ' active' : ''}`;
  }

}
