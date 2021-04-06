import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SlidesPageRoutingModule } from './slides-routing.module';
import { SlidesPage } from './slides.page';
import { PipesModule } from 'src/app/Pipe/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SlidesPageRoutingModule,
    ReactiveFormsModule,
    PipesModule
  ],
  declarations: [SlidesPage]
})
export class SlidesPageModule {}
