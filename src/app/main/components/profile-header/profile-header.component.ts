import { Component, OnInit } from '@angular/core';
import { user } from './data-source';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss'],
})
export class ProfileHeaderComponent implements OnInit {

  public user = user;

  constructor() { }

  ngOnInit(): void {
  }

  public userId(): void {
    alert(`current user id: ${user.id}`);
  }

}
