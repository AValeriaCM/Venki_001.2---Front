import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vercontenido',
  templateUrl: './vercontenido.page.html',
  styleUrls: ['./vercontenido.page.scss'],
})
export class VercontenidoPage implements OnInit {

  comments = [
    {
      id: 1,
      id_user: 3,
      user: 'Julian',
      msg: 'Es genial',
      currentTime: 155409956000,
      img: 'https://www.travelcontinuously.com/wp-content/uploads/2018/04/empty-avatar.png'
    },
    {
      id: 2,
      id_user: 4,
      user: 'Fabian',
      msg: 'Ayuda mucho a todo lo que se necesita',
      currentTime: 155401056000,
      img: 'https://www.travelcontinuously.com/wp-content/uploads/2018/04/empty-avatar.png'
    },
    {
      id: 3,
      id_user: 5,
      user: 'Julia',
      msg: 'No es de mi agrado',
      currentTime: 155401086000,
      img: 'https://www.travelcontinuously.com/wp-content/uploads/2018/04/empty-avatar.png'
    },
    {
      id: 4,
      id_user: 6,
      user: 'Nicolas',
      msg: 'falta más explicacion',
      currentTime: 155401106000,
      img: 'https://www.travelcontinuously.com/wp-content/uploads/2018/04/empty-avatar.png'
    }
  ];

  data: any;
  prueba: any;
  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe( params => {
      if ( params && params.info) {
        this.data = params.info;
      }
    });
  }
  ngOnInit() {
    this.prueba = JSON.parse(this.data);
  }

}
