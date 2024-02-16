import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AutenticacionService } from '../services/autenticacion.service';

@Injectable({
  providedIn: 'root',
})
export class EstaLogeadoGuard implements CanLoad {
  constructor(
    private authService: AutenticacionService,
    private router: Router
  ) {}
  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    
    return false;
  }

  // async canLoad(
  //   route: Route,
  //   segments: UrlSegment[]
  // ): Promise<boolean | UrlTree> {
  //   const isAutenticated = await this.authService.isLoggin();
  //   console.log('retorno ', isAutenticated);
  //   if (!isAutenticated) {
  //     this.router.navigate(['/login']);
  //   }
  //   return false;
  // }
}
