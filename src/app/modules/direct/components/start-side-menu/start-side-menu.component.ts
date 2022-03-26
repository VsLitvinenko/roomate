import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-start-side-menu',
  templateUrl: './start-side-menu.component.html',
  styleUrls: ['./start-side-menu.component.scss'],
})
export class StartSideMenuComponent implements OnInit {

  constructor(private readonly router: Router) { }

  ngOnInit() {
  }
}
