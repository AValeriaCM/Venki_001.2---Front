import { NgModule } from '@angular/core';
import { FiltroPipe } from './filtro.pipe';
import { VimeoUrlPipe } from './vimeo-url.pipe';



@NgModule({
  declarations: [FiltroPipe, VimeoUrlPipe],
  exports: [FiltroPipe, VimeoUrlPipe]
})
export class PipesModule { }
