import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { LoginService } from '../_services/login.service';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NoLogginGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router,
    private log: LoginService,
  ){}
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.auth.user.pipe(
      take(1),
      map(user => {
        console.log('user', user);
        if (!user) {
          this.router.navigateByUrl('/');
          return false;
        } else if (user) {
          this.router.navigateByUrl('/users/home');
          return true;
        }else if (user === null){
          this.router.navigateByUrl('/');
          return false;
        }else{
          this.router.navigateByUrl('/');
          return false;
        }
      })
    );
  }
  
}
