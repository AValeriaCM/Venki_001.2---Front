import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiagnosticoEtapaPageRoutingModule } from './diagnostico-etapa-routing.module';

import { DiagnosticoEtapaPage } from './diagnostico-etapa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiagnosticoEtapaPageRoutingModule
  ],
  declarations: [DiagnosticoEtapaPage]
})
export class DiagnosticoEtapaPageModule {}
