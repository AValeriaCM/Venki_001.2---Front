import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfoInicioPage } from './info-inicio.page';

const routes: Routes = [
  {
    path: '',
    component: InfoInicioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfoInicioPageRoutingModule {}
