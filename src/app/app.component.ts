import { Component } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { AuthService } from './_services/auth.service';
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';
import { ChatServiceService } from './_services/chat-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  public hasPermission: boolean;
  public token: string;
  alert: any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private fcm: FCM,
    public alertController: AlertController,
    private authS: AuthService,
    private localN: LocalNotifications,
    private chatS: ChatServiceService,
    private router: Router
  ) {
    this.initializeApp();
    this.getMovileToken();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  async getMovileToken(){
    await this.platform.ready();

    if (!this.platform.is('cordova')) {
      return;
    }

    this.hasPermission = await this.fcm.requestPushPermission();

    this.token = await this.fcm.getToken();
    this.authS.setTokenMovile(this.token);

    this.fcm
      .onTokenRefresh()
      .subscribe((newToken) => {
        this.authS.setTokenMovile(newToken);
      });
    this.fcm
      .onNotification()
      .subscribe(payload =>  {
        if (payload.wasTapped){
          if ( payload.id === 'mensaje'){
            this.localNotification(payload.title, payload.body);
            this.chatS.setbadgeMsg();
            this.chatS.var.next('msg update');
            this.router.navigate(['/users/chat']);
          } else {
            this.localNotification(payload.title, payload.body);
          }
        }else{
        if ( payload.id === 'mensaje'){
          this.localNotification(payload.title, payload.body);
          this.chatS.setbadgeMsg();
          this.chatS.var.next('msg update');
        } else {
          this.localNotification(payload.title, payload.body);
        }
        }
      });
  }

  localNotification(titleNotif: any, bodyNotif: any){
    var seconds =  1;
    this.localN.schedule({
      title: titleNotif,
      text: bodyNotif,
      trigger: {
        in: seconds,
        unit: ELocalNotificationTriggerUnit.SECOND,
      }
    });
  }
}
