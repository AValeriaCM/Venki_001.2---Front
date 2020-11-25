import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfoInicioPageRoutingModule } from './info-inicio-routing.module';

import { InfoInicioPage } from './info-inicio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfoInicioPageRoutingModule
  ],
  declarations: [InfoInicioPage]
})
export class InfoInicioPageModule {}
