import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExamenPageRoutingModule } from './examen-routing.module';

import { ExamenPage } from './examen.page';
import { PipesModule } from 'src/app/Pipe/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExamenPageRoutingModule,
    PipesModule
  ],
  declarations: [ExamenPage]
})
export class ExamenPageModule {}
