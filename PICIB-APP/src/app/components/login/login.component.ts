import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  formLogin: FormGroup;
  mensajeError: string;

  constructor(private userService: UserService, private route: Router) {
    this.formLogin = new FormGroup({
      email: new FormControl(),
      password: new FormControl(),
    });
    this.mensajeError = '';
  }

  onSubmit() {
    this.userService.isLoggedInCallbackUnaVez((user) => {
      if (!user) {
        this.userService
          .login(this.formLogin.value)
          .then(async (res) => {
            if (res.user.email) {
              const userDB = await this.userService.obtenerUsuarioPorCorreo(
                res.user.email
              );
              if (userDB?.rol == 'ADMIN') {
                this.route.navigate(['/usuarios']);
              } else if (userDB?.rol == 'GUIATIC') {
                this.route.navigate(['/inscripciones']);
              }else{
                this.route.navigate(['/inscripcion']);
              }
            }

            this.formLogin.reset();
          })
          .catch(
            (error) => (this.mensajeError = 'Correo o contraseña, incorrectas')
          );
      } else {
        this.route.navigate(['/portales']);
      }
    });
  }
}
