import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  transform(array: any[], texto: string, colum: string): any[] {
    if ( texto === ''){
      return array;
    }

    texto = texto.toLowerCase();

    return array.filter(item => {
      console.log(item[colum]);
      return item[colum].toLowerCase().includes(texto);
    });
  }

}
