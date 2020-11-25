import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImgPrevPage } from './img-prev.page';

const routes: Routes = [
  {
    path: '',
    component: ImgPrevPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImgPrevPageRoutingModule {}
