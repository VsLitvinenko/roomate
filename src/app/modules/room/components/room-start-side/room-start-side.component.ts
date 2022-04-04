import { Component, OnInit } from '@angular/core';
import { usersList } from './data-source';

@Component({
  selector: 'app-room-start-side',
  templateUrl: './room-start-side.component.html',
  styleUrls: ['./room-start-side.component.scss'],
})
export class RoomStartSideComponent implements OnInit {

  public userList = usersList;

  constructor() { }

  ngOnInit() {}

}
