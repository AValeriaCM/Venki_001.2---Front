import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TerminosNinosPage } from './terminos-ninos.page';

const routes: Routes = [
  {
    path: '',
    component: TerminosNinosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TerminosNinosPageRoutingModule {}
