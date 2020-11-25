import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnviomsjPageRoutingModule } from './enviomsj-routing.module';

import { EnviomsjPage } from './enviomsj.page';
import { AutosizeModule } from 'ngx-autosize';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AutosizeModule,
    EnviomsjPageRoutingModule,
  ],
  declarations: [EnviomsjPage]
})
export class EnviomsjPageModule {}
