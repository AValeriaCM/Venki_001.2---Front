import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'vermas',
    loadChildren: () => import('../../Pages/home/vermas/vermas.module').then( m => m.VermasPageModule)
  },
  {
    path: 'img-prev',
    loadChildren: () => import('../../Pages/home/img-prev/img-prev.module').then( m => m.ImgPrevPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
