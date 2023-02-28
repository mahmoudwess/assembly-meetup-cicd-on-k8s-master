import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  streams;
  micOn: boolean;
  constructor() { }

  ngOnInit(): void {
  }

  mute(strObj) {

  }
  disableRemoteVideo(strObj) {

  }
  hangUp(strObj) {

  }

}
