import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CursosCategoriasPageRoutingModule } from './cursos-categorias-routing.module';

import { CursosCategoriasPage } from './cursos-categorias.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CursosCategoriasPageRoutingModule
  ],
  declarations: [CursosCategoriasPage]
})
export class CursosCategoriasPageModule {}
