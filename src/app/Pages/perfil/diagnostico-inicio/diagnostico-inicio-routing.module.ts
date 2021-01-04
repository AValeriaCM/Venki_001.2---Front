import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiagnosticoInicioPage } from './diagnostico-inicio.page';

const routes: Routes = [
  {
    path: '',
    component: DiagnosticoInicioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiagnosticoInicioPageRoutingModule {}
