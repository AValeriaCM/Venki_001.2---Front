import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VideoPageRoutingModule } from './video-routing.module';
import { VideoPage } from './video.page';
import { PipesModule } from 'src/app/Pipe/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    VideoPageRoutingModule
  ],
  declarations: [VideoPage]
})
export class VideoPageModule {}
