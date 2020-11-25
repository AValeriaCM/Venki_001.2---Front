import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CursosGeneralPageRoutingModule } from './cursos-general-routing.module';

import { CursosGeneralPage } from './cursos-general.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CursosGeneralPageRoutingModule
  ],
  declarations: [CursosGeneralPage]
})
export class CursosGeneralPageModule {}
