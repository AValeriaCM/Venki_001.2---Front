import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VidplayerPageRoutingModule } from './vidplayer-routing.module';

import { VidplayerPage } from './vidplayer.page';
import { PipesModule } from 'src/app/Pipe/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VidplayerPageRoutingModule,
    PipesModule
  ],
  declarations: [VidplayerPage]
})
export class VidplayerPageModule {}
