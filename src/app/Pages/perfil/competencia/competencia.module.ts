import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompetenciaPageRoutingModule } from './competencia-routing.module';

import { CompetenciaPage } from './competencia.page';
import { PipesModule } from 'src/app/Pipe/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompetenciaPageRoutingModule,
    PipesModule
  ],
  declarations: [CompetenciaPage]
})
export class CompetenciaPageModule {}
