import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatServiceService } from 'src/app/_services/chat-service.service';
import { PassObjectService } from 'src/app/_services/pass-object.service';

@Component({
  selector: 'app-mensaje-busqueda',
  templateUrl: './mensaje-busqueda.page.html',
  styleUrls: ['./mensaje-busqueda.page.scss'],
})
export class MensajeBusquedaPage implements OnInit {

  @ViewChild(IonContent) content: IonContent;
  data: any;
  newMsg = '';
  usuarioActual: any;
  transmiterID: any;
  infoUserTransmiter: any;
  idChat: any;
  menjs: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatS: ChatServiceService,
    private pObjecto: PassObjectService) {
  }

  ngOnInit() {
    let info = this.pObjecto.getNavData();
    this.data = info.infoDt;
    this.transmiterID = info.transferID;
    this.usuarioActual = info.useractual;

    this.chatS.var.subscribe( updateTk =>  {
      console.log(updateTk);
      console.log(this.idChat);
      this.chatS.getchatsMSGUser(this.idChat).subscribe( (msgServ: any) => {
        this.menjs = msgServ.data;
        setTimeout(() => {
          this.content.scrollToBottom(200);
        });
      });
    });
  }

  enviarMsg() {
    this.chatS.crearChat(this.transmiterID, this.data.id).subscribe((responseChat: any) => {
      this.chatS.enviarMensajeChat(responseChat.data.id, this.transmiterID, this.newMsg).subscribe( responseMsg  => {
        this.chatS.getchatsMSGUser(responseChat.data.id).subscribe( msgServ => {
          this.chatS.var.next('update mgs');
          setTimeout(() => {
            this.content.scrollToBottom(200);
          });
        });
        this.newMsg = '';
      });
    });
  }

  volver() {
    this.chatS.var.next('update');
    this.router.navigate(['/users/chat']);
  }
}
