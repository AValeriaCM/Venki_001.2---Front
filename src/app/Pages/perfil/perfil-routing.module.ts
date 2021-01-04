import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilPage } from './perfil.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilPage
  },
  {
    path: 'vercontenido',
    loadChildren: () => import('../../Pages/perfil/vercontenido/vercontenido.module').then( m => m.VercontenidoPageModule)
  },
  {
    path: 'vercurso',
    loadChildren: () => import('../../Pages/perfil/vercurso/vercurso.module').then( m => m.VercursoPageModule)
  },
  {
    path: 'estadisticas',
    loadChildren: () => import('../../Pages/perfil/estadisticas/estadisticas.module').then( m => m.EstadisticasPageModule)
  },
  {
    path: 'calendario',
    loadChildren: () => import('../../Pages/perfil/calendario/calendario.module').then( m => m.CalendarioPageModule)
  },
  {
    path: 'timeline',
    loadChildren: () => import('../../Pages/perfil/timeline/timeline.module').then( m => m.TimelinePageModule)
  },
  {
    path: 'edit-perfil',
    loadChildren: () => import('../../Pages/perfil/edit-perfil/edit-perfil.module').then( m => m.EditPerfilPageModule)
  },
  {
    path: 'cursos-general',
    loadChildren: () => import('../../Pages/perfil/cursos-general/cursos-general.module').then( m => m.CursosGeneralPageModule)
  },
  {
    path: 'vercursos-general',
    loadChildren: () => import('../../Pages/perfil/vercursos-general/vercursos-general.module').then( m => m.VercursosGeneralPageModule)
  },
  {
    path: 'opciones',
    loadChildren: () => import('../../Pages/perfil/opciones/opciones.module').then( m => m.OpcionesPageModule)
  },
  {
    path: 'mis-objetivos',
    loadChildren: () => import('../../Pages/perfil/mis-objetivos/mis-objetivos.module').then( m => m.MisObjetivosPageModule)
  },
  {
    path: 'diagnostico',
    loadChildren: () => import('../../Pages/perfil/diagnostico/diagnostico.module').then( m => m.DiagnosticoPageModule)
  },
  {
    path: 'diagnostico-inicio',
    loadChildren: () => import('../../Pages/perfil/diagnostico-inicio/diagnostico-inicio.module').then( m => m.DiagnosticoInicioPageModule)
  },
  {
    path: 'recomendaciones',
    loadChildren: () => import('../../Pages/perfil/recomendaciones/recomendaciones.module').then( m => m.RecomendacionesPageModule)
  },
  {
    path: 'diagnostico-etapa',
    loadChildren: () => import('../../Pages/perfil/diagnostico-etapa/diagnostico-etapa.module').then( m => m.DiagnosticoEtapaPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilPageRoutingModule {}
