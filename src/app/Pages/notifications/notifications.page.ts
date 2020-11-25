import { Component, OnInit } from '@angular/core';
import { ChatServiceService } from 'src/app/_services/chat-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  notoficaciones = [
    {
      id: 1,
      notificacion: 'El usuario xxxxx te ah agregado como amigo',
      img_notif: 'https://cdn4.iconfinder.com/data/icons/user-avatar-flat-icons/512/User_Avatar-04-512.png'
    },
    {
      id: 2,
      notificacion: 'El usuario xxxxx te ah agregado como amigo',
      img_notif: 'https://cdn4.iconfinder.com/data/icons/user-avatar-flat-icons/512/User_Avatar-04-512.png'
    },
    {
      id: 3,
      notificacion: 'El usuario xxxxx te ah agregado como amigo',
      img_notif: 'https://cdn4.iconfinder.com/data/icons/user-avatar-flat-icons/512/User_Avatar-04-512.png'
    },
    {
      id: 4,
      notificacion: 'El usuario xxxxx te ah agregado como amigo',
      img_notif: 'https://cdn4.iconfinder.com/data/icons/user-avatar-flat-icons/512/User_Avatar-04-512.png'
    }
  ];

  msj = [];
  constructor(private chatS: ChatServiceService, private route: Router) { }

  ngOnInit() {
    this.chatS.var.subscribe( chatMsg => {
      this.msj = this.chatS.getbadge();
    });
    this.msj = this.chatS.getbadge();
  }

  openChat(){
    this.route.navigate(['/users/chat']);
  }

}
