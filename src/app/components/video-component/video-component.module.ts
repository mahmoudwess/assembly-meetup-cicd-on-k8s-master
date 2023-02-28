import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VideoComponentComponent } from './video-component.component';
import { MatIconModule, MatButtonModule } from '@angular/material';



@NgModule({
  declarations: [
    VideoComponentComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [
    VideoComponentComponent
  ]
})
export class VideoComponentModule { }
