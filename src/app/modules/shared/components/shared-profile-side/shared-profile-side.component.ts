import { Component, OnInit } from '@angular/core';
import {user} from './data-source';

@Component({
  selector: 'app-shared-profile-side',
  templateUrl: './shared-profile-side.component.html',
  styleUrls: ['./shared-profile-side.component.scss'],
})
export class SharedProfileSideComponent implements OnInit {

  public user = user;

  constructor() { }

  ngOnInit() {}

  public userId(): void {
    alert(`current user id: ${user.id}`);
  }

}
