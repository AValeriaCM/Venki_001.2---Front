import { environment } from './../../environments/environment';
import { Observable, EMPTY } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { tap, catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { LoginService } from '../_services/login.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceErrorInterceptorService implements HttpInterceptor{

  constructor(private snackBar: MatSnackBar, private aut: AuthService, private log: LoginService ) { }

  intercept(request: HttpRequest<any>,  next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(retry(environment.REINTENTOS)).
    pipe(tap(event => {
      if (event instanceof HttpResponse) {
        if (event.body && event.body.error === true && event.body.errorMessage) {
          throw new Error(event.body.errorMessage);
        }/*else{
                              //this.snackBar.open("EXITO", 'AVISO', { duration: 5000 });

                          }*/
      }
    })).pipe(catchError((err) => {
      //console.log('Entro Error Filtro');
      console.log(err);
      // err.message
      // err.error.mensaje
     
      if (err.status === 400) {
        this.snackBar.open("Proceso invalido, intenta nuevamente", 'ERROR 400', { duration: 5000 });
      } else if (err.status === 401) {
        this.snackBar.open(err.error.message, 'ERROR 401', { duration: 5000 });
        this.aut.getTokeR().then( dt => {
          this.log.loginRefreh(dt).subscribe( (info: any) => {
            console.log(info);
            this.aut.settokenlog(info.access_token,  info.refresh_token);
          });
        });
        // this.router.navigate(['/login']);
      }else if(err.status === 422){
          if(err.error.error.email){
            this.snackBar.open(err.error.error.email[0], 'ERROR 422', { duration: 5000 });
          }else if(err.error.error.phone){
            this.snackBar.open(err.error.error.phone[0], 'ERROR 422', { duration: 5000 });
          }
  
      }else if (err.status === 500) {
        this.snackBar.open(err.error.mensaje, 'ERROR 500', { duration: 5000 });
      } else {
        this.snackBar.open(`Error: ${err.status} Ha ocurrido un error, intente mas tarde`, 'ERROR', { duration: 5000 });
      }
      // this.snackBar.open(err.error.mensaje, 'ERROR', { duration: 5000 });
      // this.snackBar.open(`Error: ${err.status} Ha ocurrido un error, intente mas tarde`, 'ERROR', { duration: 5000 });
      // this.router.navigate([`/error/${err.status}/${err.error.mensaje}`]);
      // this.router.navigate([`/error/${err.status}/Lo sentimos`]);
      return EMPTY;
    }));
  }
}
