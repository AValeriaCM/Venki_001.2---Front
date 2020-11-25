import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VercursosGeneralPageRoutingModule } from './vercursos-general-routing.module';

import { VercursosGeneralPage } from './vercursos-general.page';
import { PipesModule } from 'src/app/Pipe/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VercursosGeneralPageRoutingModule,
    PipesModule
  ],
  declarations: [VercursosGeneralPage]
})
export class VercursosGeneralPageModule {}
