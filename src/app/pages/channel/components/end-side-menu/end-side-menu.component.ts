import { Component, OnInit } from '@angular/core';
import {usersImages} from './data-source';

@Component({
  selector: 'app-end-side-menu',
  templateUrl: './end-side-menu.component.html',
  styleUrls: ['./end-side-menu.component.scss'],
})
export class EndSideMenuComponent implements OnInit {

  public rooms = [
    {
      id: 1,
      title: 'room 1',
      joined: {
        total: 10,
        list: [
          { name: 'slava', img: usersImages[0] },
          { name: 'sasha', img: usersImages[1] },
          { name: 'anton', img: usersImages[2] },
          { name: 'ilvir', img: usersImages[3] },
          { name: 'sonya', img: usersImages[4] },
          { name: 'zamir', img: usersImages[5] },
        ]
      }
    },
    {
      id: 2,
      title: 'room 2',
      joined: {
        total: 5,
        list: [
          { name: 'slava', img: usersImages[0] },
          { name: 'sasha', img: usersImages[1] },
          { name: 'anton', img: usersImages[2] },
          { name: 'ilvir', img: usersImages[3] },
          { name: 'sonya', img: usersImages[4] },
        ]
      }
    },
    {
      id: 3,
      title: 'room 3',
      joined: {
        total: 2,
        list: [
          { name: 'slava', img: usersImages[0] },
          { name: 'anton', img: usersImages[2] },
        ]
      }
    },
  ];

  constructor() { }

  ngOnInit() {}

}
