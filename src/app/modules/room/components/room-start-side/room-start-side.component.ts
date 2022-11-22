import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-room-start-side',
  templateUrl: './room-start-side.component.html',
  styleUrls: ['./room-start-side.component.scss'],
})
export class RoomStartSideComponent implements OnInit {

  public userList = [];

  constructor() { }

  ngOnInit(): void {
  }

}
