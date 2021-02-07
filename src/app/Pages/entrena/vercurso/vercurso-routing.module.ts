import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VercursoPage } from './vercurso.page';

const routes: Routes = [
  {
    path: '',
    component: VercursoPage
  },
  {
    path: 'verleccion',
    loadChildren: () => import('../../../Pages/entrena/vercurso/verleccion/verleccion.module').then( m => m.VerleccionPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VercursoPageRoutingModule {}
