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
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate{
  constructor(private angularFireAuth: Auth, private router: Router, private userService: UserService) {}




  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    const user = await this.angularFireAuth.currentUser;
    const isAutenticated = user ? true : false;

    if (!isAutenticated) {
      this.router.navigate(['/login']);
    }else{
      const usuarioDatabase = await this.userService.obtenerUsuarioPorCorreo(user?.email!);

          return route.data['rolesPermitidos'].includes(usuarioDatabase?.rol) && usuarioDatabase?.estado

    }
    return isAutenticated;
  }
}
