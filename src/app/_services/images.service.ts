import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Image } from '../_model/Image';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  urlServ = 'http://venki.3utilities.com/';
  constructor(private http: HttpClient) { }


  getImages(){
    return this.http.get<Image[]>(`${this.urlServ}/api/images`, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-Requested-With', 'XMLHttpRequest')
    });
  }
}