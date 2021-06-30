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
  },
  {
    path: 'video',
    loadChildren: () => import('./video/video.module').then( m => m.VideoPageModule)
  },
  {
    path: 'audio',
    loadChildren: () => import('./audio/audio.module').then( m => m.AudioPageModule)
  },
  {
    path: 'texto',
    loadChildren: () => import('./texto/texto.module').then( m => m.TextoPageModule)
  },
  {
    path: 'quiz',
    loadChildren: () => import('./quiz/quiz.module').then( m => m.QuizPageModule)
  },
  {
    path: 'contenido',
    loadChildren: () => import('./contenido/contenido.module').then( m => m.ContenidoPageModule)
  },
  {
    path: 'examen',
    loadChildren: () => import('./examen/examen.module').then( m => m.ExamenPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerleccionPageRoutingModule {}
