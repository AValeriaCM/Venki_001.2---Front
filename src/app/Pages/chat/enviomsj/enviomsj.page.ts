import { LoginService } from 'src/app/_services/login.service';
import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { ChatServiceService } from 'src/app/_services/chat-service.service';
import { AuthService } from 'src/app/_services/auth.service';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { PusherServiceService } from 'src/app/_providers/pusher-service.service';
import { LoadingService } from 'src/app/_services/loading.service';

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
  token: any;

  constructor(
    private router: Router,
    private chatS: ChatServiceService,
    private auth: AuthService,
    private log: LoginService,
    private pObjecto: PassObjectService,
    private pusher: PusherServiceService,
    private loadingService: LoadingService
    ) {
      this.getToken();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  getToken() {
    this.auth.gettokenLog().then(resp => {
      this.token = resp;
      this.loadPage();
    });
  }

  scrollToBottom() {
    if (this.menjs.length === 15) {
      this.content.scrollToBottom();
      this.scrollBottom = true;
    }
  }

  ngOnInit() {
  }

  loadPage() {
    this.getAuhUser();
    const info = this.pObjecto.getNavData();
    if(info) {
      this.data = info.infoDt;
      this.chatId = info.infoDt.id;
      this.transmiterID = info.transferID;
      this.usuarioActual = info.useractual;
      this.pusher.channelsuscribe(this.data.id);
  
      const channel = this.pusher.init();
      channel.bind('chat_event', (data: any) => {
        this.updateMsg(data);
      });
      this.loadMessages();
      this.userList = this.data;
    }
  }

  getAuhUser() {
    this.auth.gettokenLog().then( dt => {
      this.log.logdataInfData(dt).subscribe( infoUser => {
        this.usertk = infoUser;
      });
    });
  }

  loadMessages() {
    this.loadingService.loadingPresent({spinner: "circles" });
    if(this.data.id) {
      console.log('this.data.id', this.data.id);
      this.chatS.getchatsMSGUser(this.data.id, this.token).subscribe((msgServ: any) => {
        this.total = msgServ.meta;
        this.menjs = msgServ.data;
        const currentPage = this.total.current_page;
        this.page = currentPage + 1;
        this.loadingService.loadingDismiss();
      }, error => {
        this.loadingService.loadingDismiss();
      });
    }
  }

  loadData(event) {
    setTimeout(() => {
      if(this.data.id) {
        console.log('this.data.id loadData' , this.data.id);
        const nuevoArra = this.total;
        if (this.menjs.length !== nuevoArra) {
          this.chatS.getMessageOFPages(this.data.id, this.page, this.token).subscribe((chatMsg: any) => {
            chatMsg.data.forEach(element => {
              this.menjs.unshift(element);
            });
            event.target.complete();
          })
        } else if (this.menjs.length === nuevoArra) {
          event.target.disabled = true;
        } else {
          event.target.disabled = true;
        }
      }
    }, 1000);
  }

  updateMsg(data: any) {
    this.menjs.push(data.message);
    this.content.scrollToBottom(100);
  }

  enviarMsg() {
    if(this.chatId) {
      this.loadingService.loadingPresent({spinner: "circles" });
      this.chatS.enviarMensajeChat(this.chatId, this.transmiterID, this.newMsg, this.token).subscribe( response => {
        this.chatS.getchatsMSGUser(this.chatId, this.token).subscribe( res => {
          this.chatS.var.next('update messages');
          setTimeout(() => {
            this.content.scrollToBottom(200);
          });
        });
        this.newMsg = '';
        this.loadingService.loadingDismiss();
      }, error => {
        this.loadingService.loadingDismiss();
      });
    }
  }

  volver() {
    this.router.navigate(['/users/chat']);
  }
}
