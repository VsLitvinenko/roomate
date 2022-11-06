import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-channel-start-side',
  templateUrl: './channel-start-side.component.html',
  styleUrls: ['./channel-start-side.component.scss'],
})
export class ChannelStartSideComponent implements OnInit {

  publicChannels = [
    { title: 'public 1', id: 1, unread: false },
    { title: 'public 2', id: 2, unread: true },
    { title: 'public 3', id: 3, unread: false },
  ];
  privateChannels = [
    { title: 'private 1', id: 1, unread: false },
    { title: 'private 2', id: 2, unread: false },
    { title: 'private 3', id: 3, unread: true },
    { title: 'private 4', id: 4, unread: true },
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
