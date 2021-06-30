import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { LoginService } from 'src/app/_services/login.service';
import { ShareserviceService } from 'src/app/_services/shareservice.service';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';

@Component({
  selector: 'app-recomendaciones',
  templateUrl: './recomendaciones.page.html',
  styleUrls: ['./recomendaciones.page.scss'],
})
export class RecomendacionesPage implements OnInit {

  usertk: any;
  panelOpenState = false;
  recomen: any;
  token: any;

  public payuform: any = {};
  disablePaymentButton: boolean = false;

  paymentAmount: string = '2500000';
  currency: string = 'COP';
  currencyIcon: string = '$';

  constructor(
    private router: Router,
    private auth: AuthService,
    private log: LoginService,
    private  share: ShareserviceService,
    private loadingService: LoadingService,
    private payPal: PayPal
  ) { 
    this.getToken();
  }

  ngOnInit() {
    this.loadingService.loadingPresent({spinner: "circles" });
    this.auth.gettokenLog().then( dt => {
      this.log.logdataInfData(dt).subscribe( infoUser => {
        this.usertk = infoUser;
        this.loadingService.loadingDismiss();
      }, error => {
        this.loadingService.loadingDismiss();
      });
    });
  }

  getToken() {
    this.auth.gettokenLog().then(resp => {
      this.token = resp;
    });
  }

  payWithPaypal() {
    // alert('entro');
    this.payPal.init({
      PayPalEnvironmentProduction: '',
      PayPalEnvironmentSandbox: 'AfPfIzEjMKZDvJhjO9Akrp7pv6Dk450Tp_5ZxfCzNSwhVVX_CCtOYPRmtV-dNqnPoISJs2fhJ7CS5ymG'
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        acceptCreditCards: true,
        languageOrLocale: 'es-CO',
        merchantPrivacyPolicyURL: '',
        merchantUserAgreementURL: ''
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        let payment = new PayPalPayment('3.33', 'USD', 'Description', 'sale');
        this.payPal.renderSinglePaymentUI(payment).then((res) => {
          alert('res '+ res);
          //  Successfully paid
        }, (err) => {
          // alert('error '+ err);
          // Error or render dialog closed without being successful
        });
      }, () => {
        // Error in configuration
      });
    }, () => {
      // Error in initialization, maybe PayPal isn't supported or something else
    });
  }

  hacerpremium() {
    let num = 1;
    this.share.editpremium( num , this.usertk.id ).subscribe( res => {
      this.share.var.next('update');
      this.router.navigate(['/users/perfil']);
    });
  }

  volver() {
    this.router.navigate(['/users/home']);
  }

}
