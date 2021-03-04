import { environment } from './../../environments/environment';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  url = `/api/oauth/token`;
  url2 = `/api/users`;
  basePath = `https://venki.inkdigital.co`;

  clientsec = `${environment.CLIENT_SECRET}`;
  clientid = `${environment.CLIENT_ID}`;
  constructor(private http: HttpClient, private AFauth: AngularFireAuth) // private router: Router,
  {}

  login(usuario: string, contrasena: string) {
    const body = new HttpParams()
      .set('username', usuario)
      .set('password', contrasena)
      .set('client_secret', this.clientsec)
      .set('client_id', this.clientid)
      .set('grant_type', 'password')

    return this.http.post(this.basePath + this.url, body, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-Requested-With', 'XMLHttpRequest'),
    });
  }

  loginRefreh(tokenR: any) {
    const body = new HttpParams()
      .set('refresh_token', tokenR)
      .set('client_secret', this.clientsec)
      .set('client_id', this.clientid)
      .set('grant_type', 'refresh_token');

    return this.http.post(this.basePath + this.url, body, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-Requested-With', 'XMLHttpRequest'),
    });
  }

  logdataInfData(infoUser: any){
    return this.http.get<any>(this.basePath + `/api/user`, {
      headers: new HttpHeaders()
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Authorization', 'Bearer ' + infoUser)
    });
  }
  getUsers() {
    return this.http.get<any[]>(this.basePath + this.url2, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json; charset=UTF-8')
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Accept', 'application/json'),
    });
  }

  getdata() {
    return this.http.get<any[]>(
      'https://my-json-server.typicode.com/typicode/demo/posts'
    );
  }


  saveDevice(usuario: any, code: any) {
    console.log(usuario, code);
    const body = new HttpParams()
      .set('user_id', usuario)
      .set('code', code);

    return this.http.post(this.basePath + `/api/devices`, body, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-Requested-With', 'XMLHttpRequest'),
    });
  }
}
