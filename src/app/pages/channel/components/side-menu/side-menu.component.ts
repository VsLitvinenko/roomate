import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {

  publicChannels = [
    { title: 'public 1', id: 1 },
    { title: 'public 2', id: 2 },
    { title: 'public 3', id: 3 },
  ];
  privateChannels = [
    { title: 'private 1', id: 1 },
    { title: 'private 2', id: 2 },
    { title: 'private 3', id: 3 },
    { title: 'private 4', id: 4 },
  ];

  constructor(private readonly router: Router) { }

  ngOnInit() {
  }

  public openCurrentChannel(id: string) {
    this.router.navigate(['channel', 'current', id]).then();
  }

}
