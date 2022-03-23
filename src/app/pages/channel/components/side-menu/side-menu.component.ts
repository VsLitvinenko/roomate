import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {

  publicChannels = [
    { title: 'public 1', id: 1, unread: false },
    { title: 'public 2', id: 2, unread: true },
    { title: 'public 3', id: 3, unread: false },
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

}
