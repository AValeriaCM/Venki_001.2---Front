import { MatTabsModule } from '@angular/material/tabs';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerUsuarioPageRoutingModule } from './ver-usuario-routing.module';

import { VerUsuarioPage } from './ver-usuario.page';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerUsuarioPageRoutingModule,
    MatTabsModule,
    MatExpansionModule,
    MatIconModule
  ],
  declarations: [VerUsuarioPage]
})
export class VerUsuarioPageModule {}
