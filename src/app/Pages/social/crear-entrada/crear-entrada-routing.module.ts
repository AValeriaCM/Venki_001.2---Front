import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearEntradaPage } from './crear-entrada.page';

const routes: Routes = [
  {
    path: '',
    component: CrearEntradaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearEntradaPageRoutingModule {}
