import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnviomsjPage } from './enviomsj.page';

const routes: Routes = [
  {
    path: '',
    component: EnviomsjPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnviomsjPageRoutingModule {}
