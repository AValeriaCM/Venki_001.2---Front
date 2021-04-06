import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/_services/auth.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { LoginService } from 'src/app/_services/login.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-mis-objetivos',
  templateUrl: './mis-objetivos.page.html',
  styleUrls: ['./mis-objetivos.page.scss'],
})
export class MisObjetivosPage implements OnInit {


  dynamicForm: FormGroup;
  submitted = false;
  list: any[] = [];
  alert: any;
  userId: any;
  objetivosList =  [];

  addTarget = false;

  form: FormGroup;
  isSubmitted = false;
  token: any;

  constructor(
    private route: Router,
    public alertController: AlertController,
    private share: ShareserviceService,
    private log: LoginService,
    private auth: AuthService,
    private loadingService: LoadingService,
    private snackbar: MatSnackBar 
  ) { 
    this.getToken();
  }

  ngOnInit() {
    this.loadForm();
  }

  getToken() {
    this.auth.gettokenLog().then(resp => {
      this.token = resp;
      this.getTargets();
    });
  }

  loadForm() {
    this.form = new FormGroup({
      target : new FormControl('',[Validators.required, Validators.minLength(3) , Validators.maxLength(70)]),
      date: new FormControl('')
    });
  }

  getTargets() {
    this.loadingService.loadingPresent({spinner: "circles" });
    this.auth.gettokenLog().then(dt => {
      this.log.logdataInfData(dt).subscribe(infoUser => {
        this.userId = infoUser.id;
        this.share.obtenerObhetivos(this.userId, this.token).subscribe((res: any) => {
          this.objetivosList = res.data.sort((a: any,b: any) => {
            return 0 - a.priority < b.priority ? -1 : 1
          });
          this.loadingService.loadingDismiss();
        }, error => {
          this.loadingService.loadingDismiss();
        });
      }, error => {
        this.loadingService.loadingDismiss();
      });
    });
  }

  operar() {
    if (!this.form.valid) {
      this.mostrarmensaje('Los datos ingresados no son validos', 'Error', 'red-snackbar');
      return false;
    } else {
      const that = this;
      let bt = '';
      if(that.form.value.date) {
        bt = format(new Date(that.form.value.date), 'yyyy-MM-dd');
      }
      this.objetivosList.push({
        achievement: that.form.value.target,
        date: bt
      });
      this.addTarget = false;
      this.form.reset();
    }
  }

  submit() {
    const listTargets = [];
    let i = 1;
    this.objetivosList.map( (target) => {
      listTargets.push({
        achievement: target.achievement,
        priority: i,
        date: target.date
      });
      i++;
    });
    this.loadingService.loadingPresent({spinner: "circles" });
    const form = {
      objectives: listTargets,
      user_id: this.userId 
    };
    this.share.agregarObjetivos(form, this.token).subscribe(async res => {
      if (res) {
        this.loadingService.loadingDismiss();
        this.mostrarmensaje('Los objetivos se han guardado satisfactoriamente', 'OK', 'green-snackbar');
      } else {
        this.loadingService.loadingDismiss();
        this.mostrarmensaje('Error guardando los objetivos', 'Error', 'red-snackbar');
      }
    }, error => {
      this.loadingService.loadingDismiss();
      this.mostrarmensaje('Error guardando los objetivos', 'Error', 'red-snackbar');
    });
  }

  async alerta() {
    this.alert = await this.alertController.create({
      header: 'UPS!',
      subHeader:
        'No puedes hacer eso',
      message:
        'No puedes Poner objetivos vacios Agrega tus Objetivos para poder guiarte',
      buttons: ['Acepto'],
    });
    await this.alert.present();
  }

  volver() {
    this.route.navigateByUrl('/users/perfil');
  }

  reorder(event: any) {  
    const itemMove = this.objetivosList.splice(event.detail.from, 1)[0];
    this.objetivosList.splice(event.detail.to, 0, itemMove);
    event.detail.complete();
  }
  
  mostrarmensaje(message: string, action: string, type: string) {
    this.snackbar.open(message, action, {
      duration: 2000,
      panelClass: [type],
    });
  }
}
