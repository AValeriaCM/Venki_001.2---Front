import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OlvidocPage } from './olvidoc.page';

const routes: Routes = [
  {
    path: '',
    component: OlvidocPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OlvidocPageRoutingModule {}
