import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PerfilesService {

  urlServ = 'http://venki.3utilities.com/';
  constructor(private http: HttpClient) { }


  getProfiles(){
    return this.http.get(this.urlServ + `/api/profiles`, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-Requested-With', 'XMLHttpRequest')
    });
  }

  updateProfile(idUser: any, profileid: any){

    const body = new HttpParams()
    .set('profile_id', profileid);

    return this.http.put(this.urlServ + `/api/users/${idUser}`, body ,{
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-Requested-With', 'XMLHttpRequest')
    });
  }

  getPreguntasPerfil(idPerfil: any){
    return this.http.get(this.urlServ + `/api/surveys/${idPerfil}/questions?per_page=20`, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-Requested-With', 'XMLHttpRequest')
    });
  }

  SendSurveyInfo(surveyData: any, surveyid: any, userid: any){

    const body = new HttpParams()
    .set('reply', surveyData)
    .set('survey_id', surveyid)
    .set('user_id', userid);

    return this.http.post(this.urlServ + `/api/replies`, body ,{
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-Requested-With', 'XMLHttpRequest')
    });
  }

  validation(idUser: any){
    return this.http.get(this.urlServ + `/api/users/${idUser}/replies`, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-Requested-With', 'XMLHttpRequest')
    });
  }
}
