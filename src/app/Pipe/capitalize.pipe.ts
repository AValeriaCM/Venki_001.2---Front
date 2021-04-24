import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {
  transform(value: any): any {
    if(!value) return value; 
    return value.substring(0,1).toUpperCase() + value.substr(1).toLocaleLowerCase();
  }
}
