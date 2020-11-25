import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditPerfilPageRoutingModule } from './edit-perfil-routing.module';

import { EditPerfilPage } from './edit-perfil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditPerfilPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EditPerfilPage]
})
export class EditPerfilPageModule {}
