import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { PassObjectService } from 'src/app/_services/pass-object.service';

@Component({
  selector: 'app-examen',
  templateUrl: './examen.page.html',
  styleUrls: ['./examen.page.scss'],
})
export class ExamenPage implements OnInit {

  examenDT: any;
  valorChange: any;
  totalExam: Array<any>;
  dt: any[] = [];
  tama: any;
  alert: any;
  constructor(
    private pObjecto: PassObjectService,
    private  alertController: AlertController,
    private router: Router
  ) { }

  ngOnInit() {
    
    this.totalExam = [];
    const informacion = this.pObjecto.getNavData();
    this.examenDT  = informacion.examen.exam;
    this.tama = this.examenDT.length;
  }

  obtenerVal(nombre: any,value: any, correct: any){

    this.valorChange = value;

    this.examenDT.filter( f => {
      if (this.totalExam.length === 0){
        this.totalExam.push({pregunta: nombre, val: value, corec: correct});
      }else if (this.totalExam.length > 0){
        if (f.p === nombre){
          let temDt = {pregunta: nombre, val: value, corec: correct};
          let res  = this.totalExam.map(e => {
            return e.pregunta;
          }).indexOf(nombre);
          this.totalExam[res] = temDt;
        }else if  (f.p !== nombre){
          let temDt = {pregunta: nombre, val: value, corec: correct};
          let res  = this.totalExam.map(e => {
            return e.pregunta;
          }).indexOf(nombre);
          if (res === -1){
            this.totalExam.push({pregunta: nombre, val: value, corec: correct});
          }else{
            this.totalExam[res] = temDt;
          }
        }
      }
    });

    if (this.examenDT.length > 0) {
      this.examenDT.filter(r => r.p === nombre).forEach(r => {
        r.op.forEach(element => {
          if (element.id !== value.id){
            element.select = false;
          }
        });
      });
    }
  }

  calificar(){
    let correcto = 0;
    let incorrecto = 0;

    this.totalExam.forEach( res => {
      let resco: number = +res.corec;
      if (res.val.id ===  resco){
        correcto = correcto + 1;
      }else {
        incorrecto = incorrecto + 1;
      }
    });

    console.log(correcto, incorrecto);
    this.alertDespuesTiempo(correcto, incorrecto);
    this.router.navigate(['/users/entrena/vercurso']);
  }

  async alertDespuesTiempo(correcto: any, incorrecto: any) {
    this.alert = await this.alertController.create({
      header: 'Felicidades',
      subHeader:
        'Completaste el examen tu puntaje es',
      message:
        'Correcto: ' + correcto + '\n\n' +
        'Incorrecto: ' +   incorrecto,
      buttons: ['Acepto'],
    });
    await this.alert.present();
  }

}
