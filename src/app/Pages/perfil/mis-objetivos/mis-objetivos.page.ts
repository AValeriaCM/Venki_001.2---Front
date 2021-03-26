import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { eventFromMessage } from '@sentry/browser';
import { AuthService } from 'src/app/_services/auth.service';
import { LoginService } from 'src/app/_services/login.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';

@Component({
  selector: 'app-mis-objetivos',
  templateUrl: './mis-objetivos.page.html',
  styleUrls: ['./mis-objetivos.page.scss'],
})
export class MisObjetivosPage implements OnInit {

    arreglo= ['quiero tener mayor agilidad','quiero controlar mis emociones','quiero tener mas motivacion','quiero mejorar mis habitos de bienestar','quiero tener mas confianza'];
  // ----------Pattern-----------

  emailPattern: any = /^[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})/;
  nombrePattern: any = /^[A-Za-z0-9]*$/;
  contrasenaPattern: any = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  adressPattern: any = /^[#.0-9a-zA-Z\s,-]+$/;
  phonePatten: any = /^[0-9]+$/;
  // ----------Pattern-----------

  dynamicForm: FormGroup;
  submitted = false;
  list: any[] = [];
  alert: any;
  userId: any;
  objetivosList: any;

  constructor(
    private route: Router,
    private router: ActivatedRoute,
    private formBuilder: FormBuilder,
    public alertController: AlertController,
    private share: ShareserviceService,
    private log: LoginService,
    private auth: AuthService
  ) { }

  get f() { return this.dynamicForm.controls; }
  get t() { return this.f.item as FormArray; }
  ngOnInit() {
    this.dynamicForm = this.formBuilder.group({
      item: new FormArray([])
    });

    this.auth.gettokenLog().then(dt => {
      this.log.logdataInfData(dt).subscribe(infoUser => {
        console.log(infoUser);
        this.userId = infoUser.id;
        this.share.obtenerObhetivos(this.userId).subscribe((res: any) => {
          console.log('objetivos', res);
          this.objetivosList = res.data;
        });
      });
    });

    this.share.varObjetivos.subscribe(st => {
      console.log(st,'esto es st');
      this.auth.gettokenLog().then(dt => {
        this.log.logdataInfData(dt).subscribe(infoUser => {
          console.log(infoUser);
          this.userId = infoUser.id;
          this.share.obtenerObhetivos(this.userId).subscribe((res: any) => {
            console.log('objetivos', res);
            this.objetivosList = res.data;
          });
        });
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
          console.log('Objetivo agregado', res);
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
