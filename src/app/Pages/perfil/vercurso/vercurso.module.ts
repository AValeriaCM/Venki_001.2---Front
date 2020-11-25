import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VercursoPageRoutingModule } from './vercurso-routing.module';

import { VercursoPage } from './vercurso.page';
import { PipesModule } from 'src/app/Pipe/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VercursoPageRoutingModule,
    PipesModule
  ],
  declarations: [VercursoPage]
})
export class VercursoPageModule {}
