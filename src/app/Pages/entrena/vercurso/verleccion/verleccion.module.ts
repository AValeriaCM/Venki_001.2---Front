import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerleccionPageRoutingModule } from './verleccion-routing.module';

import { VerleccionPage } from './verleccion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerleccionPageRoutingModule
  ],
  declarations: [VerleccionPage]
})
export class VerleccionPageModule {}
