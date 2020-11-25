import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MensajeBusquedaPage } from './mensaje-busqueda.page';

const routes: Routes = [
  {
    path: '',
    component: MensajeBusquedaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MensajeBusquedaPageRoutingModule {}
