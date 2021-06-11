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
      { 'target': "Mejorar mi rendimiento deportivo" },
      { 'target': "Controlar mis emociones y pensamientos" },
      { 'target': "Aprender a reponerme de los errores y mantenerme dentro de la competencia" },
      { 'target': "Tener un gran reconocimiento dentro del entorno deportivo"},
      { 'target': "Mejorar mis hábitos de bienestar"},
      { 'target': "Aumentar mi confianza"},
      { 'target': "Tener más motivación tanto en competencia como en los entrenamientos"},
      { 'target': "Adquirir mayor agilidad física y mental tanto en mi deporte como en la vida"},
      { 'target': "Concentrarme más, antes, durante y después de una actividad deportiva"},
      { 'target': "Enfocar 100% mi carrera deportiva como proyecto de vida"}
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
