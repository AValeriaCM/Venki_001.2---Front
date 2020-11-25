import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VercontenidoPage } from './vercontenido.page';

const routes: Routes = [
  {
    path: '',
    component: VercontenidoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VercontenidoPageRoutingModule {}
