import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LeccionInicioPageRoutingModule } from './leccion-inicio-routing.module';

import { LeccionInicioPage } from './leccion-inicio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeccionInicioPageRoutingModule
  ],
  declarations: [LeccionInicioPage]
})
export class LeccionInicioPageModule {}
