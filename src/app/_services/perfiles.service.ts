import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class PerfilesService {

  urlServ = 'https://venki.inkdigital.co';
  constructor(
    private http: HttpClient,
    private storage: Storage
    ) { }


  getProfiles(token: any){
    return this.http.get(this.urlServ + `/api/profiles`, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Authorization', 'Bearer ' + token)
    });
  }

  updateProfile(idUser: any, profileid: any, token: any) {
    const body = new HttpParams()
    .set('profile_id', profileid);
    return this.http.put(this.urlServ + `/api/users/${idUser}`, body ,{
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Authorization', 'Bearer ' + token)
    });
  }

  getPreguntasPerfil(idPerfil: any, token: any, category){
    return this.http.get(this.urlServ + `/api/surveys/${idPerfil}/category/${category}/questions`, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Authorization', 'Bearer ' + token)
    });
  }

  SendSurveyInfo(surveyData: any, surveyid: any, userid: any, token: any) {
    const body = new HttpParams()
    .set('reply', surveyData)
    .set('survey_id', surveyid)
    .set('user_id', userid);
    return this.http.post(this.urlServ + `/api/replies`, body ,{
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Authorization', 'Bearer ' + token)
    });
  }

  validation(idUser: any){
    return this.http.get(this.urlServ + `/api/users/${idUser}/replies`, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-Requested-With', 'XMLHttpRequest')
    });
  }

  getCalifications(idUser: any, token: any) {
    return this.http.get(this.urlServ + `/api/users/${idUser}/replies`, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Authorization', 'Bearer ' + token)
    });
  }

}
