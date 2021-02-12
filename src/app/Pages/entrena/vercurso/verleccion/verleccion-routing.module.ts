import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerleccionPage } from './verleccion.page';

const routes: Routes = [
  {
    path: '',
    component: VerleccionPage
  },
  {
    path: 'audioplayer',
    loadChildren: () => import('../../../../Pages/entrena/vercurso/verleccion/audioplayer/audioplayer.module').then( m => m.AudioplayerPageModule)
  },
  {
    path: 'vidplayer',
    loadChildren: () => import('../../../../Pages/entrena/vercurso/verleccion/vidplayer/vidplayer.module').then( m => m.VidplayerPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerleccionPageRoutingModule {}
