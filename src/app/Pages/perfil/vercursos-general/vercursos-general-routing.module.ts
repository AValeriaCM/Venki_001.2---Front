import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VercursosGeneralPage } from './vercursos-general.page';

const routes: Routes = [
  {
    path: '',
    component: VercursosGeneralPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VercursosGeneralPageRoutingModule {}
