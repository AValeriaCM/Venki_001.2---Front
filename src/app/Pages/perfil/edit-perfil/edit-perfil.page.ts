import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';
import { RegistroService } from 'src/app/_services/registro.service';
import { Registro } from 'src/app/_model/Registro';
import { Router } from '@angular/router';
import { ShareserviceService } from 'src/app/_services/shareservice.service';
import { LoginService } from 'src/app/_services/login.service';
import { LoadingService } from 'src/app/_services/loading.service';

@Component({
  selector: 'app-edit-perfil',
  templateUrl: './edit-perfil.page.html',
  styleUrls: ['./edit-perfil.page.scss'],
})
export class EditPerfilPage implements OnInit {

  items = [
    {
      situacion: 'Soltero'
    },
    {
      situacion: 'Casado'
    }
  ];

  emailPattern: any = /^[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})/;
  nombrePattern: any = /^[A-Za-z -]+$/;
  contrasenaPattern: any = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  adressPattern: any = /^[#.0-9a-zA-Z\s,-]+$/;
  phonePatten: any = /^[0-9]+$/;

  editarForm: FormGroup;
  isSubmitted = false;
  editarUser: Registro;
  usertk = null;
  situacionS = null;
  constructor(
    private auth: AuthService,
    private edit: RegistroService,
    private router: Router,
    private share: ShareserviceService,
    private log: LoginService,
    private loadingService: LoadingService 
    ) { }

  ngOnInit() {
    this.loadAuthUser();
  }

  loadAuthUser() {
    this.loadingService.loadingPresent({spinner: "circles" });
    this.auth.gettokenLog().then( dt => {
      this.log.logdataInfData(dt).subscribe( infoUser => {
        this.usertk = infoUser;
        this.loadingService.loadingDismiss();
        this.inicializarFormulario(this.usertk);
      }, error => {
        this.loadingService.loadingDismiss();
      });
    });
  }


  inicializarFormulario(dt: any) {
    this.editarForm = new FormGroup({
      name : new FormControl(dt.name,
      [Validators.required, Validators.min(5) , Validators.max(35), Validators.pattern(this.nombrePattern)]),
      lastname : new FormControl(dt.lastname,
      [Validators.required, Validators.min(5) , Validators.max(35), Validators.pattern(this.nombrePattern)]),
      birthday : new FormControl(dt.birthday, [Validators.required]),
      email : new FormControl(dt.email,
      [Validators.required, Validators.min(7) , Validators.max(70), Validators.pattern(this.emailPattern)]),
      phone : new FormControl(dt.phone,
      [Validators.required, Validators.minLength(8) , Validators.maxLength(22), Validators.pattern(this.phonePatten)]),
      description : new FormControl(dt.description,
      [Validators.required]),
      institution : new FormControl(dt.institution,
        [Validators.required, Validators.min(5) , Validators.max(35), Validators.pattern(this.nombrePattern)]),
      city : new FormControl(dt.city,
          [Validators.required, Validators.min(5) , Validators.max(35), Validators.pattern(this.nombrePattern)]),
    });
  }

  editar(){
    this.editarUser = this.editarForm.value;
    this.edit.Editartodo(this.editarUser, this.usertk.id, this.situacionS).subscribe( response => {
      this.auth.updateToken();
      this.share.var.next('data update');
      this.router.navigateByUrl('/users/perfil');
    });
  }

  optionsFn(it: any){
    this.situacionS = it.situacion;
  }
}
