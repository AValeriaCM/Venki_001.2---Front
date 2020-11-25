import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VermasPageRoutingModule } from './vermas-routing.module';

import { VermasPage } from './vermas.page';
import { PipesModule } from 'src/app/Pipe/pipes.module';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VermasPageRoutingModule,
    PipesModule,
    SharedDirectivesModule
  ],
  declarations: [VermasPage]
})
export class VermasPageModule {}
