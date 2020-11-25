import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OlvidocPageRoutingModule } from './olvidoc-routing.module';

import { OlvidocPage } from './olvidoc.page';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OlvidocPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [OlvidocPage]
})
export class OlvidocPageModule {}
