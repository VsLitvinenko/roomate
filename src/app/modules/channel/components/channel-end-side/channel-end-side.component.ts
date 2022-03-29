import { Component, OnInit } from '@angular/core';
import {usersImages} from './data-source';

@Component({
  selector: 'app-end-side-menu',
  templateUrl: './channel-end-side.component.html',
  styleUrls: ['./channel-end-side.component.scss'],
})
export class ChannelEndSideComponent implements OnInit {

  public rooms = [
    {
      id: 1,
      title: 'room 1',
      private: true,
      joined: {
        total: 10,
        list: [
          { name: 'slava', img: usersImages[0] },
          { name: 'sasha', img: usersImages[1] },
          { name: 'anton', img: usersImages[2] },
          { name: 'ilvir', img: usersImages[3] },
          { name: 'sonya', img: usersImages[4] },
          // { name: 'zamir', img: usersImages[5] },
        ]
      }
    },
    {
      id: 2,
      title: 'room 2',
      private: false,
      joined: {
        total: 4,
        list: [
          { name: 'slava', img: usersImages[0] },
          { name: 'sasha', img: usersImages[1] },
          { name: 'anton', img: usersImages[2] },
          { name: 'ilvir', img: usersImages[3] },
        ]
      }
    },
    {
      id: 3,
      title: 'room 3',
      private: false,
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
