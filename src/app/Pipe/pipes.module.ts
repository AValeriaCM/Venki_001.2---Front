import { NgModule } from '@angular/core';
import { FiltroPipe } from './filtro.pipe';
import { VimeoUrlPipe } from './vimeo-url.pipe';
import { TitlePipe } from './title.pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';


@NgModule({
  declarations: [FiltroPipe, VimeoUrlPipe, TitlePipe],
  exports: [FiltroPipe, VimeoUrlPipe, TitlePipe, Ng2SearchPipeModule]
})
export class PipesModule { }
