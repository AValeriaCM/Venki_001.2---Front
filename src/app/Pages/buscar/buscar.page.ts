import { LoginService } from './../../_services/login.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.page.html',
  styleUrls: ['./buscar.page.scss'],
})
export class BuscarPage implements OnInit {

  data: any[] = [];
  textoBuscar = '';
  constructor(private log: LoginService) { }

  ngOnInit() {
    this.log.getdata().subscribe(dt => {
      this.data = dt;
    });
  }

  buscar(event){
    this.textoBuscar = event.detail.value;
  }

}
