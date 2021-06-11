import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Image } from '../_model/Image';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  urlServ = 'https://venki.inkdigital.co';
  constructor(private http: HttpClient) { }


  getImages(token) {
    return this.http.get<Image[]>(`${this.urlServ}/api/images`, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Authorization', 'Bearer ' + token)
    });
  }
}