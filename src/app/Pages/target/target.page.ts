import { Component, OnInit } from '@angular/core';
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

  constructor(
    private share: ShareserviceService,
    private log: LoginService,
    private auth: AuthService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.getTargets();
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

}
