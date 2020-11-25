import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecomendacionesPageRoutingModule } from './recomendaciones-routing.module';

import { RecomendacionesPage } from './recomendaciones.page';
import {MatExpansionModule} from '@angular/material/expansion';
import { PipesModule } from 'src/app/Pipe/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecomendacionesPageRoutingModule,
    MatExpansionModule,
    PipesModule
  ],
  declarations: [RecomendacionesPage]
})
export class RecomendacionesPageModule {}
