import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PublicacionPageRoutingModule } from './publicacion-routing.module';

import { PublicacionPage } from './publicacion.page';
import { PipesModule } from 'src/app/Pipe/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PublicacionPageRoutingModule,
    PipesModule
  ],
  declarations: [PublicacionPage]
})
export class PublicacionPageModule {}
