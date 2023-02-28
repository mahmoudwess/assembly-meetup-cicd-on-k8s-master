import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomComponent } from './room.component';
import { RoomRoutingModule } from './room-routing.module';
import { VideoComponentModule } from 'src/app/components/video-component/video-component.module';
import { RouterModule } from '@angular/router';
// import { VideoComponentComponent } from 'src/app/components/video-component/video-component.component';



@NgModule({
  declarations: [RoomComponent],
  imports: [
    CommonModule,
    RoomRoutingModule,
    VideoComponentModule,
    RouterModule.forChild([]),
  ] 
})
export class RoomModule { }
