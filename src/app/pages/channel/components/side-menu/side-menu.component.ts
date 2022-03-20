import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {

  publicChannels = [
    'public 1',
    'public 2',
    'public 3',
    'public 4',
    'public 5',
  ];

  privateChannels = [
    'private 1',
    'private 2',
    'private 3',
    'private 4',
    'private 5',
  ];

  constructor() { }

  ngOnInit() {}

}
