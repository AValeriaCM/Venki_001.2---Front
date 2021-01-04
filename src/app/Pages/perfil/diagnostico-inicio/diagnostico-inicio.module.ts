import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiagnosticoInicioPageRoutingModule } from './diagnostico-inicio-routing.module';

import { DiagnosticoInicioPage } from './diagnostico-inicio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiagnosticoInicioPageRoutingModule
  ],
  declarations: [DiagnosticoInicioPage]
})
export class DiagnosticoInicioPageModule {}
