import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/_services/auth.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { LoginService } from 'src/app/_services/login.service';
import { PassObjectService } from 'src/app/_services/pass-object.service';
import { PerfilesService } from 'src/app/_services/perfiles.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.page.html',
  styleUrls: ['./categoria.page.scss'],
})
export class CategoriaPage implements OnInit {

  colors = ['card-1', 'card-2', 'card-3'];
  descriptions = ['card-descriptions-1', 'card-descriptions-2', 'card-descriptions-3'];

  token: any;
  usertk = null;
  profileUser = null;
  profileId = null;
  form: FormGroup;
  alert: any;

  get profilesArray() {
    return this.form.get('profiles') as FormArray;
  }

  constructor(
    private auth: AuthService,
    private log: LoginService,
    private loadingService: LoadingService,
    private porfiles: PerfilesService,
    private formBuilder: FormBuilder,
    public alertController: AlertController,
    private snackbar: MatSnackBar,
    private pObjecto: PassObjectService,
    private router: Router,
    private share: ShareserviceService
  ) { }

  ngOnInit() {
    this.getToken();
    this.loadForm();
  }

  getToken() {
    this.auth.gettokenLog().then(resp => {
      this.token = resp;
      this.loadingService.loadingPresent({spinner: "circles" });
      this.log.logdataInfData(resp).subscribe( resp => {
        this.usertk = resp;
        this.profileUser = this.usertk.profile.name;
        this.profileId = this.usertk.profile.id;
        this.getProfiles();
        this.loadingService.loadingDismiss();
      }, error => {
        this.loadingService.loadingDismiss();
      });
    });
  }

  loadForm() {
    this.form = new FormGroup({
      profiles: this.formBuilder.array([], {validators: this.minProfileSelected })
    });
  }

  minProfileSelected: ValidatorFn = (form: FormArray) => {
    const selected = form.controls.map( control => control.value.selected).reduce( (prev, next) => next ? prev + next : prev, 0);
    return selected >=1 ? null : { required: true};
  }

  getProfiles() {
    this.loadingService.loadingPresent({message: "Por favor espere", spinner: "circles" });
    console.log('this.token', this.token);
    this.porfiles.getProfiles(this.token).subscribe((resp: any) => {
      console.log('resp', resp);
      this.loadProfiles(resp);
      this.loadingService.loadingDismiss();
    }, error => {
      this.loadingService.loadingDismiss();
    });
  }

  loadProfiles(profiles: any) {
    var i = 0;
    profiles.data.map( (profile: any) => {
      this.profilesArray.push(
        this.formBuilder.group({
          index: new FormControl(this.profilesArray.controls.length),
          profile: new FormControl(profile),
          selected: new FormControl( profile.id == this.profileId ? true : false ),
          color: new FormControl(this.colors[i]),
          descriptions: new FormControl(this.descriptions[i]),
        })
      );
      i == 2 ? i = 0 : i++;
    });
  }

  selectProfile(event: any, index: number) {
    if(event) {
      this.profilesArray.controls.filter( control => control.get('index').value !== index ).map( control => {
        control.get('selected').setValue(false);
      });
    }
  }

  async confirm() {
    const that = this;
    this.alert = await this.alertController.create({
      header: '¡TEN MUY PRESENTE!',
      message: 'Al cambiar tu perfil actual modificará todo tu programa de entrenamiento. ¿Estas seguro que deseas ajustarlo?',
      buttons: [
        {
          text: 'Confirmar',
          cssClass: 'confirm-category',
          handler: () => {
            this.alert.dismiss(true);
              return false;
          }
        }, 
        {
          text: 'Cancelar',
          cssClass: 'cancel-category',
          handler: () => {
            this.alert.dismiss(false);
              return false;
          }
        }
      ],
    });
    await this.alert.present();
    await this.alert.onDidDismiss().then((data) => {
      that.submit(data.data);
    });
    return true;
  }

  submit(choice: any) {
    if(choice === true) {
      const profile = this.profilesArray.controls.find( control => control.get('selected').value === true );
      if(profile) {
        if(profile.value.profile.id === this.profileId) {
          this.mostrarmensaje('Debes seleccionar un perfil distinto al actual', 'Error', 'red-snackbar');
        } else {
          this.loadingService.loadingPresent({message: "Por favor espere", spinner: "circles" });
          this.porfiles.updateProfile(this.usertk.id, profile.value.profile.id, this.token).subscribe( resp => {
            this.profileUser = profile.value.profile.name;
            this.profileId = profile.value.profile.id;
            this.mostrarmensaje('Tu perfil ha sido ajustado', '¡Muy bien!', 'green-snackbar');
            this.loadingService.loadingDismiss();
          }, error => {
            this.loadingService.loadingDismiss();
          });
        }
      }
    }
  }
  mostrarmensaje(message: string, action: string, type: string) {
    this.snackbar.open(message, action, {
      duration: 2000,
      panelClass: [type],
    });
  }

  back() {
    const data = { 
      id: this.profileId,
      name: this.profileUser
    };

    this.share.varProfile.next(data);
    this.router.navigate(['/users/perfil']);
  }
}
