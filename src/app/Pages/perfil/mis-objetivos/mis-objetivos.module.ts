import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisObjetivosPageRoutingModule } from './mis-objetivos-routing.module';

import { MisObjetivosPage } from './mis-objetivos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisObjetivosPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [MisObjetivosPage]
})
export class MisObjetivosPageModule {}
