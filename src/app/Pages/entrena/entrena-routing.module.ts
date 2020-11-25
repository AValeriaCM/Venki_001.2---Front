import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EntrenaPage } from './entrena.page';

const routes: Routes = [
  {
    path: '',
    component: EntrenaPage
  },
  {
    path: 'audioplayer',
    loadChildren: () => import('../../Pages/entrena/audioplayer/audioplayer.module').then( m => m.AudioplayerPageModule)
  },
  {
    path: 'vidplayer',
    loadChildren: () => import('../../Pages/entrena/vidplayer/vidplayer.module').then( m => m.VidplayerPageModule)
  },
  {
    path: 'vercurso',
    loadChildren: () => import('../../Pages/entrena/vercurso/vercurso.module').then( m => m.VercursoPageModule)
  },
  {
    path: 'cursos-categorias',
    loadChildren: () => import('../../Pages/entrena/cursos-categorias/cursos-categorias.module').then( m => m.CursosCategoriasPageModule)
  },
  {
    path: 'examen',
    loadChildren: () => import('../../Pages/entrena/examen/examen.module').then( m => m.ExamenPageModule)
  },
  {
    path: 'info-premium',
    loadChildren: () => import('../../Pages/entrena/info-premium/info-premium.module').then( m => m.InfoPremiumPageModule)
  },
  {
    path: 'info-inicio',
    loadChildren: () => import('../../Pages/entrena/info-inicio/info-inicio.module').then( m => m.InfoInicioPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntrenaPageRoutingModule {}
