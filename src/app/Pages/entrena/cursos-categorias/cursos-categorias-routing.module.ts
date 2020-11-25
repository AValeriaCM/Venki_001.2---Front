import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CursosCategoriasPage } from './cursos-categorias.page';

const routes: Routes = [
  {
    path: '',
    component: CursosCategoriasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CursosCategoriasPageRoutingModule {}
