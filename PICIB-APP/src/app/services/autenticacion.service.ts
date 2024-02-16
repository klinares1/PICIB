import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  constructor(private router: Router,private angularFireAuth: Auth) {}

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const user = await this.angularFireAuth.currentUser;
    const isAutenticated = user ? true : false;
    if (!isAutenticated) {
      this.router.navigate(['/login']);
    }
    return isAutenticated;
  }


  async isLoggin(){
    const user =  this.angularFireAuth.currentUser;

    return user ? true : false;
  }
}
