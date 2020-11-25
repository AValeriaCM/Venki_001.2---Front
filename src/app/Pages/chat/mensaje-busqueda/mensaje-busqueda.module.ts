import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MensajeBusquedaPageRoutingModule } from './mensaje-busqueda-routing.module';

import { MensajeBusquedaPage } from './mensaje-busqueda.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MensajeBusquedaPageRoutingModule
  ],
  declarations: [MensajeBusquedaPage]
})
export class MensajeBusquedaPageModule {}
