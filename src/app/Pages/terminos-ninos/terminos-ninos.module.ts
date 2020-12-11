import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TerminosNinosPageRoutingModule } from './terminos-ninos-routing.module';

import { TerminosNinosPage } from './terminos-ninos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TerminosNinosPageRoutingModule
  ],
  declarations: [TerminosNinosPage]
})
export class TerminosNinosPageModule {}
