import { Component, ViewChild } from '@angular/core';
import { NotificacionesPushComponent } from '../notificaciones-push/notificaciones-push.component';
import { Portal } from 'src/app/model/portal.mode';
import { Resultado } from 'src/app/model/resultado.model';
import { Notificacion } from 'src/app/model/notificaciones.model';
import { PortalesService } from 'src/app/services/portales.service';

@Component({
  selector: 'app-portales-gestor',
  templateUrl: './portales-gestor.component.html',
  styleUrls: ['./portales-gestor.component.css'],
})
export class PortalesGestorComponent {
  isVisibleFormularioPortales = false;
  portalEditarSeleccionado: Portal;
  @ViewChild('notificacion') notificacionHide: NotificacionesPushComponent;
  public portales: Portal[] = [];
  constructor(private portalesServices: PortalesService) {
    this.portalEditarSeleccionado = {};
  }
  ngOnInit(): void {
    this.portalesServices.getPortales().subscribe((portal) => {
      this.portales = portal;
    });
  }

  async deletePortal(portal: Portal) {
    try {
      const response = await this.portalesServices.deletePortal(portal);
      this.resultadoFormularioPortal({
        mensage: 'Se elimino correctamente el portal',
        result: true,
        response: response,
      });
    } catch (error) {
      this.resultadoFormularioPortal({
        mensage: 'No se pudo eliminar el portal',
        result: false,
        response: error,
      });
    }
  }

  selectPortalEditar(portal: Portal) {
    this.isVisibleFormularioPortales = true;
    this.portalEditarSeleccionado = portal;
  }

  onFormularioPortalHide(isVisible: boolean) {
    this.isVisibleFormularioPortales = isVisible;
  }
  showChild() {
    this.portalEditarSeleccionado = {
      nombre: '',
      horariosAtencion: '',
      ubicacion: '',
      estado: false,
    };
    this.isVisibleFormularioPortales = true;
  }

  mostrarNotificacion() {
    this.notificacionHide.showNotificacion = true;
    setTimeout(() => {
      this.notificacionHide.showNotificacion = false;
    }, 3000);
  }

  resultadoFormularioPortal(result: Resultado) {
    this.notificacionHide.mensajeNotificacion = result.mensage;
    if (result.result) {
      this.notificacionHide.typeNotificacion = Notificacion.SUCCESS;
    } else {
      this.notificacionHide.typeNotificacion = Notificacion.WARNING;
    }
    this.mostrarNotificacion();
  }
}
