import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/_services/auth.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { LoginService } from 'src/app/_services/login.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';

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

  constructor(
    private route: Router,
    private formBuilder: FormBuilder,
    public alertController: AlertController,
    private share: ShareserviceService,
    private log: LoginService,
    private auth: AuthService,
    private loadingService: LoadingService
  ) { }

  get f() { return this.dynamicForm.controls; }
  get t() { return this.f.item as FormArray; }
  ngOnInit() {
    this.dynamicForm = this.formBuilder.group({
      item: new FormArray([])
    });

    this.getTargets();
  }

  getTargets() {
    this.loadingService.loadingPresent({spinner: "circles" });
    this.auth.gettokenLog().then(dt => {
      this.log.logdataInfData(dt).subscribe(infoUser => {
        this.userId = infoUser.id;
        this.share.obtenerObhetivos(this.userId).subscribe((res: any) => {
          this.objetivosList = res.data;
          this.loadingService.loadingDismiss();
        }, error => {
          this.loadingService.loadingDismiss();
        });
      }, error => {
        this.loadingService.loadingDismiss();
      });
    });
  }


  onDetalles() {
    this.t.push(this.formBuilder.group({
      item: [''],
    }));
  }

  onReset(i: number) {
    this.t.removeAt(i);
  }

  onClear() {
    this.submitted = false;
    this.t.reset();
  }

  operar() {
    this.submitted = true;
    this.list = this.t.value;
    let correct = 0;
    let incorrect = 0;
    this.list.forEach(dt => {
      if (dt.item === '') {
        incorrect = incorrect + 1;
      } else {
        correct = correct + 1;
      }
    });

    if (incorrect > 0) {
      this.alerta();
    } else if (correct === this.list.length) {
      this.list.forEach(dt => {
        this.share.agregarObjetivos(dt.item, this.userId).subscribe(res => {
        });
      });
      this.share.varObjetivos.next('objetivos agregados');
      this.share.var.next('Objetivo Agregado');
      this.t.clear();
    }
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
  
  reorder(event){  
      const itemMover = this.objetivosList.splice(event.detail.from ,1)[0];
      this.objetivosList.splice(event.detail.to, 0, itemMover);
      event.detail.complete(true);
      
  } 
  
}
