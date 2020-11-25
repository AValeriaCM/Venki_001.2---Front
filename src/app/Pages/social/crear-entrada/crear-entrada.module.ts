import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearEntradaPageRoutingModule } from './crear-entrada-routing.module';

import { CrearEntradaPage } from './crear-entrada.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearEntradaPageRoutingModule
  ],
  declarations: [CrearEntradaPage]
})
export class CrearEntradaPageModule {}
