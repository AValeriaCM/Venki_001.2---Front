import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VercontenidoPageRoutingModule } from './vercontenido-routing.module';

import { VercontenidoPage } from './vercontenido.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VercontenidoPageRoutingModule
  ],
  declarations: [VercontenidoPage]
})
export class VercontenidoPageModule {}
