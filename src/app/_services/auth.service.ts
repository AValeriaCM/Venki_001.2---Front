import { Observable, BehaviorSubject, from } from 'rxjs';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { JwtHelperService} from '@auth0/angular-jwt';
import { Platform } from '@ionic/angular';
import * as CryptoJS from 'crypto-js';
import { switchMap, map, take } from 'rxjs/operators';
import { LoginService } from './login.service';
import { ShareserviceService } from './shareservice.service';


const SECRET_KEY = 'UTF45qweR';
const helper = new JwtHelperService();
const TOKEN_KEY = 'Oauth-token';
const TOKEN_KEY_REFRESH = 'Oauth-token-refresh';
const TOKE_PRIMERA_VEZ = 'state-frist-time';
const TOKEN_PRIMERA_MOVILE = 'M_TK';
const USER_INFO = 'user-dt';
const INFO_TEMP = 'tempInfo';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: Observable<any>;
  private userData = new BehaviorSubject(null);
  private DataFinal = new BehaviorSubject(null);
  private primeraV: any;

  constructor(private storage: Storage,
              private plt: Platform,
              private loginService: LoginService,
              private router: Router,
              private shareSercie: ShareserviceService) {
                this.loadStoreToken();
              }

  loadStoreToken(){
    let pltOb = from(this.plt.ready());
    this.user = pltOb.pipe(
      switchMap( ()  => {
        return from(this.storage.get(TOKEN_KEY));
      }),
      map(token => {
        if (token){
          let decode = helper.decodeToken(token);
          let infoData = this.getDataToken(token);
          this.DataFinal.next(infoData);
          this.userData.next(decode);
          return true;
        }else{
          return null;
        }
      })
    );
  }



  login(correo: string, contrasena: string){
    return this.loginService.login(correo, contrasena).pipe(
      take(1),
      map( res => {
            this.storage.set(TOKEN_KEY_REFRESH, res['refresh_token']);
            return res['access_token'];
      }),
      switchMap(token => {
        let decode = helper.decodeToken(token);
        this.getDataToken(token);
        this.userData.next(decode);
        let storageObs = from( this.storage.set(TOKEN_KEY, token));
        return storageObs;
      })
    );
  }

  setTokenMovile(movileTk: any){
    this.storage.set(TOKEN_PRIMERA_MOVILE, movileTk);
  }

  getUser(){
    return this.userData.getValue();
  }

  getUserData(){
    return this.storage.get(USER_INFO).then( key => {
      this.DataFinal.next(this.DesEncryptar(key));
      return this.DataFinal.getValue();
    });
  }

  getDataToken(token: any){
    this.shareSercie.gerDataService(token).subscribe( res => {
      this.storage.set(USER_INFO, this.Encriptar(res));
      this.DataFinal.next(res);
    });
  }

  settokenLog(token: any) {
    this.storage.set(TOKEN_KEY, token); 
  }

  gettokenLog(){
    return this.storage.get(TOKEN_KEY);
  }

  gettokenDevice(){
    return this.storage.get(TOKEN_PRIMERA_MOVILE);
  }

  updateToken(){
    this.storage.remove(USER_INFO);
    this.storage.get(TOKEN_KEY).then( token  => {
      this.getDataToken(token);
    });
  }

  setPrimeraVez(){
    this.storage.set(TOKE_PRIMERA_VEZ, 'true');
  }

  setNomolestarP(){
    this.storage.remove(TOKE_PRIMERA_VEZ);
    this.storage.set(TOKE_PRIMERA_VEZ, 'false');
  }

  getPrimeraVez(){
    return this.storage.get(TOKE_PRIMERA_VEZ).then( key => {
      return key;
    });
  }


  Encriptar(informacion: any){
    let encryptData = CryptoJS.AES.encrypt(JSON.stringify(informacion), SECRET_KEY).toString();
    return encryptData;
  }

  EncriptarData(informacion: any){
    this.storage.set(INFO_TEMP, informacion);
  }

  getdataTemp(){
    return this.storage.get(INFO_TEMP);
  }

  DesEncryptarData(dataCrypt: any){
    let bytes = CryptoJS.AES.decrypt(dataCrypt, SECRET_KEY);
    var obj = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return obj;
  }

  DesEncryptar(dataCrypt: any){
    let bytes = CryptoJS.AES.decrypt(dataCrypt, SECRET_KEY);
    var obj = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return obj;
  }

  logout(){
    this.storage.remove(USER_INFO);
    this.storage.remove(TOKEN_KEY).then( ()  => {
      this.router.navigateByUrl('/');
      this.userData.next(null);
    });
  }

  getTokeR(){
    return this.storage.get(TOKEN_KEY_REFRESH);
  }

  settokenlog(accestok: any,  tokrefresh: any){
    this.storage.set(TOKEN_KEY, accestok);
    this.storage.set(TOKEN_KEY_REFRESH, tokrefresh);
  }

}
