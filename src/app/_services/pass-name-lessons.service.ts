import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PassNameLessonsService {

  index: number;
  constructor() { }

  setData(index:number){
    return this.index = index;
  }

  getData(){
    return this.index;
  }
}
