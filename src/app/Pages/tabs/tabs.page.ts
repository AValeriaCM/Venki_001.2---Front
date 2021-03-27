import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/_services/auth.service';
import { ChatServiceService } from 'src/app/_services/chat-service.service';
import { LoginService } from 'src/app/_services/login.service';
import { InfoPremiumPage } from '../entrena/info-premium/info-premium.page';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  usertk;
  msj;


  constructor(
    private auth: AuthService,
    private log: LoginService,
    private modelcontroller: ModalController,
    private chatS: ChatServiceService
  ) { }

  ngOnInit() {
    this.chatS.var.subscribe(chatMsg => {
      this.msj = this.chatS.getbadge();
    });
    this.msj = this.chatS.getbadge();
  }

  validarPremium(){

    this.auth.gettokenLog().then( dt => {
      this.log.logdataInfData(dt).subscribe( infoUser => {
        this.usertk = infoUser;
        if (this.usertk.premium === 0){
            this.imageView();
        }
      });
    });

  }

  imageView(){
    this.modelcontroller.create({
      component: InfoPremiumPage,
    }).then(model => model.present());
  }

}
