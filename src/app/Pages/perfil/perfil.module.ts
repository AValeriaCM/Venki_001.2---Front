import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilPageRoutingModule } from './perfil-routing.module';

import { PerfilPage } from './perfil.page';
import {MatTabsModule} from '@angular/material/tabs';
import { PipesModule } from 'src/app/Pipe/pipes.module';
import {MatExpansionModule} from '@angular/material/expansion';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilPageRoutingModule,
    MatTabsModule,
    PipesModule,
    MatExpansionModule,
    SharedDirectivesModule
  ],
  declarations: [PerfilPage]
})
export class PerfilPageModule {}
