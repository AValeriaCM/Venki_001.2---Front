import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertController } from '@ionic/angular';
import { PerfilesService } from 'src/app/_services/perfiles.service';
import { LoginService } from 'src/app/_services/login.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { FormGroup, FormArray, FormBuilder, FormControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.page.html',
  styleUrls: ['./slides.page.scss'],
})
export class SlidesPage implements OnInit {
  image: 'https://via.placeholder.com/150';
  data: any;
  alert: any;
  valorChange: any;
  mensaje: any;
  select  =  false;
  userInf: any;
  form: FormGroup;
  token: any;
  message_header: string;

  colors = ['card-1', 'card-2', 'card-3'];
  descriptions = ['card-descriptions-1', 'card-descriptions-2', 'card-descriptions-3'];

  get profilesArray() {
    return this.form.get('profiles') as FormArray;
  }

  constructor(
    private router: Router,
    private auth: AuthService,
    public alertController: AlertController,
    private porfiles: PerfilesService,
    private log: LoginService,
    private loadingService: LoadingService,
    private formBuilder: FormBuilder,
    private route: Router
  ) {}

  ngOnInit() {
    this.validateProfileUserAuth();
    this.loadForm();
    this.getToken();
    this.getCurrentHour();
  }

  validateProfileUserAuth() {
    this.auth.gettokenLog().then(tkInf => {
      if (tkInf !== null) {
        this.log.logdataInfData(tkInf).subscribe(resTk => {
          this.auth.gettokenDevice().then(DeviceTk => {
            if (DeviceTk !== null) {
              this.log.saveDevice(resTk.id, DeviceTk);
            }
          });
          if (resTk.profile_id == null) {
            this.getProfiles();
          } else {
            this.route.navigateByUrl('/users/home');
          }
        });
      }
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

  getToken() {
    this.auth.gettokenLog().then(resp => {
      this.token = resp;
    });
  }

  getProfiles() {
    this.loadingService.loadingPresent({message: "Por favor espere", spinner: "circles" });
    this.porfiles.getProfiles(this.token).subscribe((resp: any) => {
      this.loadProfiles(resp);
      this.auth.gettokenLog().then( tkInf => {
        if (tkInf !==  null) {
          this.log.logdataInfData(tkInf).subscribe( resTk => {
            if (resTk) {
              this.userInf = resTk;
            }
          });
        }
        this.loadingService.loadingDismiss();
      });
    }, error => {
      this.loadingService.loadingDismiss();
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

  loadProfiles(profiles: any) {
    var i = 0;
    profiles.data.map( (profile: any) => {
      this.profilesArray.push(
        this.formBuilder.group({
          index: new FormControl(this.profilesArray.controls.length),
          profile: new FormControl(profile),
          selected: new FormControl(false),
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

  continuar() {
    if (!this.form.valid) {
      this.alertDespuesTiempo();
    } else { 
      const profile = this.profilesArray.controls.find( control => control.get('selected').value === true );
      if(profile) {
        this.loadingService.loadingPresent({message: "Por favor espere", spinner: "circles" });
        this.porfiles.updateProfile(this.userInf.id, profile.value.profile.id, this.token).subscribe( profileUpdate => {
          this.auth.setNomolestarP();
          this.loadingService.loadingDismiss();
          this.router.navigateByUrl('/target');
        }, error => {
          this.loadingService.loadingDismiss();
        });
      }
    }
  }

  async alertDespuesTiempo() {
    this.mensaje = 'Debe seleccionar Un perfil';
  }
}
