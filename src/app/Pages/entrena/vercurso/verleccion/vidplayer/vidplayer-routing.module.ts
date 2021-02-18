import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VidplayerPage } from './vidplayer.page';

const routes: Routes = [
  {
    path: '',
    component: VidplayerPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VidplayerPageRoutingModule {}
