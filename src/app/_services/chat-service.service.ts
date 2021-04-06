import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatServiceService {

  url = 'https://fcm.googleapis.com/fcm/send';
  urlServ = `${environment.HOST}`;

  private msjServ = [];

  var = new Subject<string>();

  constructor(private http: HttpClient) { }

  getbadge() {
    return this.msjServ;
  }

  removeNotification() {
    this.msjServ = [];
  }

  setbadgeMsg() {
    let notif = 0;
    notif = notif + 1;
    this.msjServ.push(notif);
  }

  sendMessageNotif(phoneId: any, userchar: any, message: any) {

    const transferObject = {

      to: phoneId,
      priority: 'high',
      notification: {
        title: 'Mensaje de: ' + userchar,
        body: message,
        click_action: 'FCM_PLUGIN_ACTIVITY',
        icon: 'myicon',
        sound: 'default',
        badge: 1,
      },
      data: {
        id: 'mensaje',
        mesnaje: userchar
      }
    };

    const object = JSON.stringify(transferObject);

    return this.http.post(this.url, object, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Authorization', 'key=AAAA9bFxozk:APA91bGuZHS0VIiRUs9EAW_etUMW8rr3oUPAOn0by2MhqXqw8_Gu92El1p-PeOJ4jEtUDjQTZR6-xtQG935qsFIeZ0AS8ZDeas3ZQdZC968Er3Vg8mUDZsnWjkgZ9VwmOHf7NgScUyG2')
    });
  }


  getAllUsers(correo: any, token: any) {
    return this.http.get<any>(this.urlServ + `api/users?query=name|=|${correo}`, {
      headers: new HttpHeaders()
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Authorization', 'Bearer ' + token)
    });
  }

  getchatsUser(idUser: any, token: any) {
    return this.http.get<any[]>(this.urlServ + `api/users/${idUser}/chats`, {
      headers: new HttpHeaders()
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Authorization', 'Bearer ' + token)
    });
  }

  crearChat(transmiterID: any, reciberID: any, token: any) {
    const body = new HttpParams()
      .set('transmitter_id', transmiterID)
      .set('receiver_id', reciberID);
    return this.http.post(this.urlServ + `api/chats`, body, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Authorization', 'Bearer ' + token)
    });
  }

  enviarMensajeChat(chatid: any, userid: any, msg: any, token:any) {
    const body = new HttpParams()
      .set('chat_id', chatid)
      .set('user_id', userid)
      .set('message', msg);

    return this.http.post(this.urlServ + `api/messages`, body, {
      headers: new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('X-Requested-With', 'XMLHttpRequest')
      .set('Authorization', 'Bearer ' + token)
    });
  }

  getchatsMSGUser(idUser: any, token: any) {
    return this.http.get<any[]>(this.urlServ + `api/chats/${idUser}/messages?page=1&orber_by=created_at&direction=desc`, {
      headers: new HttpHeaders()
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Authorization', 'Bearer ' + token)
    });
  }

  getMessageOFPages(idChat: any, idPage: any, token: any){
    return this.http.get<any[]>(this.urlServ + `api/chats/${idChat}/messages?page=${idPage}&orber_by=created_at&direction=desc`, {
      headers: new HttpHeaders()
        .set('X-Requested-With', 'XMLHttpRequest')
        .set('Authorization', 'Bearer ' + token)
    });
  }
}
