import { Component, ViewChild } from '@angular/core';
import { NotificacionesPushComponent } from '../notificaciones-push/notificaciones-push.component';
import { Usuario } from 'src/app/model/usuarios.model';
import { UserService } from 'src/app/services/user.service';
import { Notificacion } from 'src/app/model/notificaciones.model';
import { Resultado } from 'src/app/model/resultado.model';

@Component({
  selector: 'app-usuarios-gestor',
  templateUrl: './usuarios-gestor.component.html',
  styleUrls: ['./usuarios-gestor.component.css'],
})
export class UsuariosGestorComponent {
  isVisibleFormularioUsuarios = false;
  usuarioEditarSeleccionado: Usuario;
  @ViewChild('notificacion') notificacionHide: NotificacionesPushComponent;

  filtroNombreUsuario: string = '';
  filtroCorreoUsuario: string = '';
  filtroRolUsuario: string = '';
  filtroEstadoUsuario: string;

  public usuarios: Usuario[] = [];
  constructor(private usuariosServices: UserService) {
    this.usuarioEditarSeleccionado = {};
  }
  ngOnInit(): void {
    this.usuariosServices.getUsuarios().subscribe((usuario) => {
      this.usuarios = usuario;
    });
  }

  async deleteUsuario(usuario: Usuario) {
    try {
      const response = await this.usuariosServices.deleteUsuario(usuario);
      this.resultadoFormularioUsuario({
        mensage: 'Se elimino correctamente el usuario',
        result: true,
        response: response,
      });
    } catch (error) {
      this.resultadoFormularioUsuario({
        mensage: 'No se pudo eliminar el usuario',
        result: false,
        response: error,
      });
    }
  }

  selectUsuarioEditar(usuario: Usuario) {
    this.isVisibleFormularioUsuarios = true;
    this.usuarioEditarSeleccionado = usuario;
  }

  onFormularioUsuarioHide(isVisible: boolean) {
    this.isVisibleFormularioUsuarios = isVisible;
  }
  showChild() {
    this.usuarioEditarSeleccionado = {};
    this.isVisibleFormularioUsuarios = true;
  }

  mostrarNotificacion() {
    this.notificacionHide.showNotificacion = true;
    setTimeout(() => {
      this.notificacionHide.showNotificacion = false;
    }, 3000);
  }

  resultadoFormularioUsuario(result: Resultado) {
    this.notificacionHide.mensajeNotificacion = result.mensage;
    if (result.result) {
      this.notificacionHide.typeNotificacion = Notificacion.SUCCESS;
    } else {
      this.notificacionHide.typeNotificacion = Notificacion.WARNING;
    }
    this.mostrarNotificacion();
  }

  filtrarUsuarios() {
    this.usuariosServices.getUsuarios().subscribe((usuarios) => {
      this.usuarios = usuarios.filter(
        (user) =>
          user.nombre
            ?.toLowerCase()
            .includes(this.filtroNombreUsuario.toLowerCase()) &&
          user.correoElectronico
            ?.toLowerCase()
            .includes(this.filtroCorreoUsuario.toLowerCase()) &&
          user.rol
            ?.toLowerCase()
            .includes(this.filtroRolUsuario.toLowerCase()) &&
          (this.filtroEstadoUsuario? user.estado === (this.filtroEstadoUsuario ==="true"): true)
      );
    });
  }
}
