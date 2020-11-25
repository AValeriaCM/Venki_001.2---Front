import { Injectable } from '@angular/core';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class PassObjectService {

  navData: any;
  constructor() { }

  setData(navObj){
    this.navData = navObj;
  }

  getNavData(){
    if (this.navData  ===  null || this.navData  === undefined){
      return 0;
    }else {
      return this.navData;
    }
  }
}
