import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SocialPage } from './social.page';

const routes: Routes = [
  {
    path: '',
    component: SocialPage
  },
  {
    path: 'image-modal',
    loadChildren: () => import('../../Pages/social/image-modal/image-modal.module').then( m => m.ImageModalPageModule)
  },
  {
    path: 'ver-usuario',
    loadChildren: () => import('../../Pages/social/ver-usuario/ver-usuario.module').then( m => m.VerUsuarioPageModule)
  },
  {
    path: 'crear-entrada',
    loadChildren: () => import('../../Pages/social/crear-entrada/crear-entrada.module').then( m => m.CrearEntradaPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SocialPageRoutingModule {}
