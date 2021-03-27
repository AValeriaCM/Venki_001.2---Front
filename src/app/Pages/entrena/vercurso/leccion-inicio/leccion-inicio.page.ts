import { PassNameLessonsService } from './../../../../_services/pass-name-lessons.service';
import { Router } from '@angular/router';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-leccion-inicio',
  templateUrl: './leccion-inicio.page.html',
  styleUrls: ['./leccion-inicio.page.scss'],
})
export class LeccionInicioPage implements OnInit {

  alerta: any;
  informacion:any;
  categorias: any[] = [];
  cursos:any[] = [];
  leccion: number;

  constructor(
    private pObjectIndex: PassNameLessonsService,  
    public alertController: AlertController,
    private pObjecto: PassObjectService,
    private router: Router
  ) { }

  ngOnInit() {
    this.leccion = this.pObjectIndex.getData();
    this.informacion = this.pObjecto.getNavData();
  }
  
  async leccionRedirect(){
    this.pObjectIndex.setData(this.leccion);
    this.pObjecto.setData(this.informacion);
    this.router.navigate(['/users/entrena/vercurso/verleccion']);
  }
}
