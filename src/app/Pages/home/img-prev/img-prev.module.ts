import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImgPrevPageRoutingModule } from './img-prev-routing.module';

import { ImgPrevPage } from './img-prev.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ImgPrevPageRoutingModule
  ],
  declarations: [ImgPrevPage]
})
export class ImgPrevPageModule {}
