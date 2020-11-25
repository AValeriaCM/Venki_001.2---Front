import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfoPremiumPageRoutingModule } from './info-premium-routing.module';

import { InfoPremiumPage } from './info-premium.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfoPremiumPageRoutingModule
  ],
  declarations: [InfoPremiumPage]
})
export class InfoPremiumPageModule {}
