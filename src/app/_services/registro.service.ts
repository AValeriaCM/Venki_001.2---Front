import { Registro } from './../_model/Registro';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  url2 = `api/users`;
  basePath = `${environment.HOST}`;

  constructor(private http: HttpClient ) { }

  registro(regist: Registro) {

    const body = new HttpParams()
      .set('name', regist.name)
      .set('lastname', regist.lastname)
      .set('birthday', regist.birthday)
      .set('email', regist.email)
      .set('password', regist.password)
      .set('password_confirmation', regist.password)
      .set('phone', regist.phone)
      .set('register_social', String(regist.register_social));


    return this.http.post(this.basePath + this.url2, body, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-Requested-With', 'XMLHttpRequest')
    });
  }

  Editar(regist: Registro, id: number) {

    const body = new HttpParams()
      .set('name', regist.name)
      .set('lastname', regist.lastname)
      .set('birthday', regist.birthday)
      .set('email', regist.email)
      .set('phone', regist.phone)
      .set('description', regist.description)
      .set('city', regist.city)
      .set('institution', regist.institution);


    return this.http.put(this.basePath + this.url2 + `/${id}`, body, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-Requested-With', 'XMLHttpRequest')
    });
  }


  Editartodo(regist: Registro, id: number, estado: any) {

    const body = new HttpParams()
      .set('name', regist.name)
      .set('lastname', regist.lastname)
      .set('birthday', regist.birthday)
      .set('email', regist.email)
      .set('phone', regist.phone)
      .set('description', regist.description)
      .set('city', regist.city)
      .set('institution', regist.institution)
      .set('status', estado);


    return this.http.put(this.basePath + this.url2 + `/${id}`, body, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-Requested-With', 'XMLHttpRequest')
    });
  }

}
