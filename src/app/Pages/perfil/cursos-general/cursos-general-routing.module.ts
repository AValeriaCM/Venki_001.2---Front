import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CursosGeneralPage } from './cursos-general.page';

const routes: Routes = [
  {
    path: '',
    component: CursosGeneralPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CursosGeneralPageRoutingModule {}
