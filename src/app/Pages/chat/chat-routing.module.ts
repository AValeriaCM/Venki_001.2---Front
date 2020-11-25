import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatPage } from './chat.page';

const routes: Routes = [
  {
    path: '',
    component: ChatPage
  },
  {
    path: 'enviomsj',
    loadChildren: () => import('../../Pages/chat/enviomsj/enviomsj.module').then( m => m.EnviomsjPageModule)
  },
  {
    path: 'mensaje-busqueda',
    loadChildren: () => import('../../Pages/chat/mensaje-busqueda/mensaje-busqueda.module').then( m => m.MensajeBusquedaPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatPageRoutingModule {}
