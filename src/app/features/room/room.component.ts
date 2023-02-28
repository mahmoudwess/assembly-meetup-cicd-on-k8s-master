import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SockerIoService } from 'src/app/providers/socker-io.service';
import { Observable } from 'rxjs';
import { tap, filter } from "rxjs/operators";
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  @ViewChild('video', {static: true}) video: ElementRef<HTMLVideoElement>;

  localStream: Observable<MediaStream | Blob | MediaSource>;
  remoteStreams: StreamObject[];

  constructor(
    private readonly socketIo: SockerIoService,
    private readonly route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.socketIo.init(params.get('id'));
      console.log(params.get('id'))
    });
    this.localStream = this.socketIo.localStream$.asObservable().
      pipe(
        filter(_ => !!_),
        tap(_ => console.log(_)),
    );

    this.socketIo.remoteStreams$
      .subscribe((rs) => {
        console.log(rs);
        this.remoteStreams = rs;
      });
  }

  muteAll() {
    this.remoteStreams.forEach(s => {
      s.stream.getAudioTracks()[0].enabled = false;
    });
  }


}
