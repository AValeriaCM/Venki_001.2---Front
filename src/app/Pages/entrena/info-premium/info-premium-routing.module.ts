import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InfoPremiumPage } from './info-premium.page';

const routes: Routes = [
  {
    path: '',
    component: InfoPremiumPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfoPremiumPageRoutingModule {}
