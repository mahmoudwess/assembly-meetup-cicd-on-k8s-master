import { Component, OnInit, Input, ViewChild, ElementRef, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-video-component',
  templateUrl: './video-component.component.html',
  styleUrls: ['./video-component.component.scss']
})
export class VideoComponentComponent implements OnInit, OnChanges {
  @Input() src: StreamObject;
  @ViewChild('video', { static: true }) video: ElementRef<HTMLVideoElement>;
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onStop: EventEmitter<any> = new EventEmitter();
  isOwner: boolean = true;
  constructor() { }

  ngOnInit() {

  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.src.currentValue) {
      const _video = this.video.nativeElement;
      const obj: StreamObject = changes.src.currentValue;
      _video.srcObject = obj.stream;
      obj.stream.getAudioTracks()[0].enabled = false;
      _video.play();
    }
  }
  get isMute() {
    return this.src && this.src.stream.getAudioTracks()[0].enabled;
  }
  get isLive() {
    return this.src && this.src.stream.getVideoTracks()[0].enabled;
  }

  stopCamera() {
    this.src.stream.getVideoTracks()[0].enabled = !this.src.stream.getVideoTracks()[0].enabled;
  }
  mute() {
    console.log(this.src);
    this.src.stream.getAudioTracks()[0].enabled = !this.src.stream.getAudioTracks()[0].enabled;
  }
  close() {
    this.onStop.emit();
  }

}
