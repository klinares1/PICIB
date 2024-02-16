import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class LoginblockGuard implements CanActivate {
  constructor(

    private router: Router,
    private userService: UserService
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {

    const user = this.userService.isLoggedIn();
    if (user) {

      this.router.navigate(['/inscripcion']);
      return false;
    }



    return true;
  }

}
