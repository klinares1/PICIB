import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { user } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuarios.model';

import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-menu-superior',
  templateUrl: './menu-superior.component.html',
  styleUrls: ['./menu-superior.component.css'],
})
export class MenuSuperiorComponent implements OnInit, OnChanges {
  isLoggin: boolean = false;
  userLogeado: Usuario;
  isCheckedMenuHambuger:boolean;
  constructor(public userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.isLoggedInCallback(async (user) => {
      if (user) {
        const userDB = await this.userService.obtenerUsuarioPorCorreo(
          user.email!
        );
        if (userDB) {
          this.userLogeado = userDB;
        }

        this.isLoggin = true;
      } else {
        this.userLogeado = {};
        this.isLoggin = false;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {}
  cerrarSesion() {
    this.userService.logout().then(() => {
      this.router.navigate(['/login']);
      this.userLogeado = {};
      this.isLoggin = false;
    });
  }


}
