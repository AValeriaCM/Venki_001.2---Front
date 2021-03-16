import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SlidesPageRoutingModule } from './slides-routing.module';

import { SlidesPage } from './slides.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SlidesPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SlidesPage]
})
export class SlidesPageModule {}
