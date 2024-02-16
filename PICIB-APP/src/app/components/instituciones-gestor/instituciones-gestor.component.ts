import { Component, ViewChild } from '@angular/core';
import { Institucion } from 'src/app/model/Institucion.model';
import { Notificacion } from 'src/app/model/notificaciones.model';
import { Resultado } from 'src/app/model/resultado.model';
import { InstitucionesService } from 'src/app/services/instituciones.service';
import { NotificacionesPushComponent } from '../notificaciones-push/notificaciones-push.component';

@Component({
  selector: 'app-instituciones-gestor',
  templateUrl: './instituciones-gestor.component.html',
  styleUrls: ['./instituciones-gestor.component.css'],
})
export class InstitucionesGestorComponent {
  isVisibleFormularioInstituciones = false;
  institucionEditarSeleccionado: Institucion;
  @ViewChild('notificacion') notificacionHide: NotificacionesPushComponent;
  public instituciones: Institucion[] = [];
  constructor(private institucionService: InstitucionesService) {
    this.institucionEditarSeleccionado = {};
  }
  ngOnInit(): void {
    this.institucionService.getInstituciones().subscribe((institucion) => {
      this.instituciones = institucion;
    });
  }

  async deleteInstitucion(institucion: Institucion) {
    try {
      const response = await this.institucionService.deleteInstitucion(
        institucion
      );
      this.resultadoFormularioInstitucion({
        mensage: 'Se elimino correctamente la institucion',
        result: true,
        response: response,
      });
    } catch (error) {
      this.resultadoFormularioInstitucion({
        mensage: 'No se pudo eliminar el curso',
        result: false,
        response: error,
      });
    }
  }

  selectInstitucionEditar(institucion: Institucion) {
    this.isVisibleFormularioInstituciones = true;
    this.institucionEditarSeleccionado = institucion;
  }

  onFormularioInstitucionHide(isVisible: boolean) {
    this.isVisibleFormularioInstituciones = isVisible;
    this.institucionEditarSeleccionado ={};
  }
  showChild() {
    this.institucionEditarSeleccionado = {
      nombre: '',

      estado: false,
    };
    this.isVisibleFormularioInstituciones = true;
  }

  mostrarNotificacion() {
    this.notificacionHide.showNotificacion = true;
    setTimeout(() => {
      this.notificacionHide.showNotificacion = false;
    }, 3000);
  }

  resultadoFormularioInstitucion(result: Resultado) {

    this.notificacionHide.mensajeNotificacion = result.mensage;
    if (result.result) {
      this.notificacionHide.typeNotificacion = Notificacion.SUCCESS;
    } else {
      this.notificacionHide.typeNotificacion = Notificacion.WARNING;
    }
    this.mostrarNotificacion();
  }
}
