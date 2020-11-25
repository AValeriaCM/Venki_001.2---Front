import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MisObjetivosPage } from './mis-objetivos.page';

const routes: Routes = [
  {
    path: '',
    component: MisObjetivosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisObjetivosPageRoutingModule {}
