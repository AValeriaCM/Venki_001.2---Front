import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PassObjectVideoService {

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
