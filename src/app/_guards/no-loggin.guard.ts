import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NoLogginGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router,
  ){}
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.auth.user.pipe(
      take(1),
      map(user => {
        if(!user) {
          return true;
        } else {
          this.router.navigateByUrl('/users/home');
          return false;
        }
      })
    );
  }
}
