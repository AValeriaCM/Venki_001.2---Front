import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VermasPage } from './vermas.page';

const routes: Routes = [
  {
    path: '',
    component: VermasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VermasPageRoutingModule {}
