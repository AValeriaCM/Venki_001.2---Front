import { AuthService } from './../_services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Storage } from '@ionic/storage';
import { ShareserviceService } from '../_services/shareservice.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router,
    private storage: Storage,
    private shareSercie: ShareserviceService
  ) { }

    canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot) {
        if (this.auth.auth()) {
          return true;
        } else {
          this.storage.remove('user-dt');
          this.shareSercie.guardarLeccionActiva(null);
          this.router.navigateByUrl('/login');
          return false;
        }
    }

}
