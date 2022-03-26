import { Component, OnInit } from '@angular/core';
import { splitPaneBreakPoint } from '../../shared/constants';

@Component({
  selector: 'app-direct',
  templateUrl: './direct.page.html',
  styleUrls: ['./direct.page.scss'],
})
export class DirectPage implements OnInit {
  public readonly splitPaneSize = splitPaneBreakPoint.size;

  constructor() { }

  ngOnInit() {
  }

}
