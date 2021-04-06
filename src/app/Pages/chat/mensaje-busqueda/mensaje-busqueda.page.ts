import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Router } from '@angular/router';
import { ChatServiceService } from 'src/app/_services/chat-service.service';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { AuthService } from 'src/app/_services/auth.service';
import { PusherServiceService } from 'src/app/_providers/pusher-service.service';
import { LoadingService } from 'src/app/_services/loading.service';

@Component({
  selector: 'app-mensaje-busqueda',
  templateUrl: './mensaje-busqueda.page.html',
  styleUrls: ['./mensaje-busqueda.page.scss'],
})
export class MensajeBusquedaPage implements OnInit {

  @ViewChild(IonContent) content: IonContent;
  data: any;
  newMsg = null;
  usuarioActual: any;
  transmiterID: any;
  infoUserTransmiter: any;
  idChat: any;
  menjs: any;
  token: any;

  constructor(
    private router: Router,
    private chatS: ChatServiceService,
    private pObjecto: PassObjectService,
    private auth: AuthService,
    private pusher: PusherServiceService,
    private loadingService: LoadingService
  ) {
    this.getToken();
  }

  ngOnInit() {
  }

  getToken() {
    this.auth.gettokenLog().then(resp => {
      this.token = resp
      this.loadPage();
    });
  }

  loadPage() {
    let info = this.pObjecto.getNavData();
    if(info) {
      this.data = info.infoDt;
      this.transmiterID = info.transferID;
      this.usuarioActual = info.useractual;
      this.pusher.channelsuscribe(this.data.id);
    
      const channel = this.pusher.init();
      channel.bind('chat_event', (data: any) => {
        this.updateMsg(data);
      });
  
      if(this.idChat) {
        this.chatS.var.subscribe( updateTk =>  {
          this.chatS.getchatsMSGUser(this.idChat, this.token).subscribe( (msgServ: any) => {
            this.menjs = msgServ.data;
            setTimeout(() => {
              this.content.scrollToBottom(200);
            });
          });
        });
      }
    }
  }

  updateMsg(data: any) {
    this.menjs.push(data.message);
    this.content.scrollToBottom(100);
  }

  enviarMsg() {
    if(this.newMsg) {
      this.loadingService.loadingPresent({spinner: "circles" });
      this.chatS.crearChat(this.transmiterID, this.data.id, this.token).subscribe((responseChat: any) => {
        this.idChat = responseChat.data.id;
        this.chatS.enviarMensajeChat(responseChat.data.id, this.transmiterID, this.newMsg, this.token).subscribe( responseMsg  => {
          this.chatS.getchatsMSGUser(responseChat.data.id, this.token).subscribe( msgServ => {
            this.chatS.var.next('update mgs');
            setTimeout(() => {
              this.content.scrollToBottom();
            });
            this.loadingService.loadingDismiss();
          }, error => {
            this.loadingService.loadingDismiss();
          });
          this.newMsg = null;
        }, error => {
          this.loadingService.loadingDismiss();
        });
      }, error => {
        this.loadingService.loadingDismiss();
      });
    }
  }

  volver() {
    this.router.navigate(['/users/chat']);
  }
}
