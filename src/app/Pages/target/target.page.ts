import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { LoginService } from 'src/app/_services/login.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';

@Component({
  selector: 'app-target',
  templateUrl: './target.page.html',
  styleUrls: ['./target.page.scss'],
})
export class TargetPage implements OnInit {

  targets =  [];
  userId: any;
  usertk = null;
  message_header: string;
  token: any;

  constructor(
    private share: ShareserviceService,
    private log: LoginService,
    private auth: AuthService,
    private loadingService: LoadingService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {
    this.getDataInfo();
    this.getCurrentHour();
    this.getToken();
  }

  ngOnInit() {
    this.getTargets();
  }

  getToken() {
    this.auth.gettokenLog().then(resp => {
      this.token = resp
    });
  }
  
  getDataInfo() {
    this.auth.gettokenLog().then( dt => {
      this.log.logdataInfData(dt).subscribe( infoUser => {
        this.usertk = infoUser;
      });
    });
  }

  getTargets() {
    this.targets.push(
      { 'target': "Quiero tener mayor agilidad fisica y mental en mi vida y para mi deporte." },
      { 'target': "Quiero controlar mis emociones y pensamientos." },
      { 'target': "Quiero tener más motivación tanto en competencia como entrenamientos." },
      { 'target': "Quiero mejorar mis habitos de bienestar."},
      { 'target': "Quiero tener más confianza."},
      { 'target': "Quiero concentrarme más antes, durante y despues una actividad deportiva."},
      { 'target': "Quiero tener un mejor rendimiento para mi deporte."},
      { 'target': "Quiero enfocar mi proyecto de vida 100% hacía mi carrera Deportiva."},
      { 'target': "Quiero aprender a reponerme de los errores y 'volver rápido' a la competencia."},
      { 'target': "Quiero tener un gran reconocimiento dentro del entorno deportivo."}
    );
  }

  reorder(event: any) {  
    const itemMove = this.targets.splice(event.detail.from, 1)[0];
    this.targets.splice(event.detail.to, 0, itemMove);
    event.detail.complete();
  } 

  submit() {
    const listTargets = [];
    let i = 1;
    this.targets.map( (target) => {
      listTargets.push({
        achievement: target.target,
        priority: i,
        date: ""
      });
      i++;
    });
    this.loadingService.loadingPresent({spinner: "circles" });
    const form = {
      objectives: listTargets,
      user_id: this.usertk.id
    };
    this.share.agregarObjetivos(form, this.token).subscribe(async res => {
      if (res) {
        this.loadingService.loadingDismiss();
        this.mostrarmensaje('Los objetivos se han guardado satisfactoriamente', 'OK', 'green-snackbar');
        this.router.navigateByUrl('/users/home');
      } else {
        this.loadingService.loadingDismiss();
        this.mostrarmensaje('Error guardando los objetivos', 'Error', 'red-snackbar');
      }
    }, error => {
      this.loadingService.loadingDismiss();
      this.mostrarmensaje('Error guardando los objetivos', 'Error', 'red-snackbar');
      this.auth.logout();
    });
  }

  getCurrentHour() {
    var today = new Date()
    var curHr = today.getHours()
    if (curHr < 12) {
      this.message_header = "Buenos días";
    } else if (curHr < 18) {
      this.message_header = "Buenas tardes";
    } else {
      this.message_header = "Buenas noches";
    }
  }

  mostrarmensaje(message: string, action: string, type: string) {
    this.snackbar.open(message, action, {
      duration: 2000,
      panelClass: [type],
    });
  }
}
