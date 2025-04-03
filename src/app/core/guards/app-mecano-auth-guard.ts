import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';


@Injectable({
    providedIn: 'root'
})
export class AppMecanoAuthGuard  {

    constructor(
        protected router: Router,
        protected location: Location) { }

    canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
      if (this.isAccessAllowed()) {
        return true;
      }
      const state = this.location.getState() as any;
      if (state && Object.keys(state).length > 0) {
        this.router.navigate(['backoffice']);
      } else {
        this.router.navigate(['backoffice']);
      }
      return false;
    }

    isAccessAllowed(): boolean {
      let storedUser = sessionStorage.getItem('connected_admin');
      if (storedUser) {
        let parsedUser = JSON.parse(storedUser);
        if(parsedUser.role === "MECANICIEN"){
          return true;
        }
        return false;
      }
      return false;
    }

}


