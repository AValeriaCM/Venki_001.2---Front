import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiagnosticoEtapaPage } from './diagnostico-etapa.page';

const routes: Routes = [
  {
    path: '',
    component: DiagnosticoEtapaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiagnosticoEtapaPageRoutingModule {}
