import { LoginService } from 'src/app/_services/login.service';
import { Component, OnInit, ViewChild, AfterViewChecked, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { ChatServiceService } from 'src/app/_services/chat-service.service';
import { AuthService } from 'src/app/_services/auth.service';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { PusherServiceService } from 'src/app/_providers/pusher-service.service';

@Component({
  selector: 'app-enviomsj',
  templateUrl: './enviomsj.page.html',
  styleUrls: ['./enviomsj.page.scss'],
})
export class EnviomsjPage implements OnInit, AfterViewChecked {


  @ViewChild(IonContent) content: IonContent;
  data: any;
  newMsg = '';
  usuarioActual: any;
  transmiterID: any;
  infoUserTransmiter: any;
  userList: Array<any>;
  chatId: any;
  menjs: any[] = [];
  total: any;
  page: any;
  scrollBottom = true;
  usertk = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatS: ChatServiceService,
    private auth: AuthService,
    private log: LoginService,
    private pObjecto: PassObjectService,
    private pusher: PusherServiceService) {

  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.menjs.length === 15) {
      console.log('entre ');
      this.content.scrollToBottom(100);
      this.scrollBottom = false;
    }
  }

  ngOnInit() {
    const info = this.pObjecto.getNavData();
    console.log('esta es la info', info);
    this.data = info.infoDt;
    this.chatId = info.infoDt.id;
    this.transmiterID = info.transferID;
    this.usuarioActual = info.useractual;
    console.log('datos', this.chatId, this.transmiterID, this.usuarioActual, this.data);
    this.pusher.channelsuscribe(this.data.id);

    const channel = this.pusher.init();
    channel.bind('chat_event', data => {
      console.log('recepcion evento', data);
      this.updateMsg(data);
    });

    this.chatS.getchatsMSGUser(this.data.id).subscribe((msgServ: any) => {
      console.log('mensajes del chat', msgServ);
      this.total = msgServ.meta;
      this.menjs = msgServ.data.reverse();
      const currentPage = this.total.current_page;
      this.page = currentPage + 1;
    });
    this.userList = this.data;

    this.auth.gettokenLog().then( dt => {
      this.log.logdataInfData(dt).subscribe( infoUser => {
        console.log(infoUser);
        this.usertk = infoUser;
      });
    });

  }

  loadData(event) {
    setTimeout(() => {
      const nuevoArra = this.total;
      if (this.menjs.length !== nuevoArra) {
        this.chatS.getMessageOFPages(this.data.id, this.page).subscribe((chatMsg: any) => {
          chatMsg.data.forEach(element => {
            this.menjs.unshift(element);
          });
          //this.page = this.page + 1;
          event.target.complete();
          console.log(this.menjs);
        })
      } else if (this.menjs.length === nuevoArra) {
        event.target.disabled = true;
      } else {
        event.target.disabled = true;
      }
    }, 1000);
  }

  updateMsg(data: any) {
    console.log('mensaje de pusher', data);
    this.menjs.push(data.message);
    this.content.scrollToBottom(100);
  }

  /*enviarMsg() {
    this.chatS.enviarMensajeChat(this.data.id, this.transmiterID, this.newMsg).subscribe((responseMsg: any) => {
      console.log(responseMsg);
      let chatid = responseMsg.data.chat_id;
      let createat = responseMsg.data.created_at;
      let idDT = responseMsg.data.id;
      let msg = responseMsg.data.message;
      let update = responseMsg.data.updated_at;
      let userId = responseMsg.data.user_id;
      let idparse: number = +userId;
      let charparse: number = +chatid;

      let dataObj = {
        chat_id: charparse,
        created_at: createat,
        id: idDT,
        message: msg,
        updated_at: update,
        user_id: idparse
      };

      // this.menjs.push(dataObj);
      setTimeout(() => {
        this.content.scrollToBottom(200);
      });
      this.newMsg = '';
    });
  }*/

  enviarMsg() {
    this.chatS.enviarMensajeChat(this.chatId, this.transmiterID, this.newMsg).subscribe( response => {
      this.chatS.getchatsMSGUser(this.chatId).subscribe( res => {
        this.chatS.var.next('update messages');
        setTimeout(() => {
          this.content.scrollToBottom(200);
        });
      });
      this.newMsg = '';
    });
  }

  volver() {
    // this.chatS.var.next('update');
    this.router.navigate(['/users/chat']);
  }
}
