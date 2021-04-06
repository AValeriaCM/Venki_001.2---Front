import { environment } from './../../environments/environment';
import { Observable, EMPTY } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { tap, catchError, retry } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';
import { LoginService } from '../_services/login.service';
import { LoadingService } from '../_services/loading.service';

@Injectable({
  providedIn: 'root'
})
export class ServiceErrorInterceptorService implements HttpInterceptor{

  constructor(private snackBar: MatSnackBar, private aut: AuthService, private log: LoginService, private loadingService: LoadingService ) { }

  intercept(request: HttpRequest<any>,  next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(retry(environment.REINTENTOS)).
    pipe(tap(event => {
      if (event instanceof HttpResponse) {
        if (event.body && event.body.error === true && event.body.errorMessage) {
          throw new Error(event.body.errorMessage);
        }
      }
    })).pipe(catchError((err) => {
      this.loadingService.loadingDismiss();
      if (err.status === 400) {
        this.snackBar.open('Credenciales incorrectas. Vuelve a intentarlo o selecciona "¿Olvidaste tu contraseña?" para cambiarla.', 'ERROR', { 
          duration: 5000, 
          panelClass: ['red-snackbar'] 
        });
      } else if (err.status === 401) {
        this.aut.logout();
        this.snackBar.open(err.error.message, 'ERROR', { 
          duration: 5000,
          panelClass: ['red-snackbar']  
        });
      }else if(err.status === 422){
          if(err.error.error.email){
            this.snackBar.open(err.error.error.email[0], 'ERROR', { 
              duration: 5000, 
              panelClass: ['red-snackbar'] 
            });
          }else if(err.error.error.phone){
            this.snackBar.open(err.error.error.phone[0], 'ERROR', { 
              duration: 5000,
              panelClass: ['red-snackbar']
            });
          }
      }else if (err.status === 500) {
        this.snackBar.open(err.error.mensaje, 'ERROR', { 
          duration: 5000 , 
          panelClass: ['red-snackbar'] 
        });
      } else {
        this.snackBar.open(`Error: ${err.status} Ha ocurrido un error, intente mas tarde`, 'ERROR', { 
          duration: 5000,
          panelClass: ['red-snackbar']  
        });
      }
      return EMPTY;
    }));
  }
}
