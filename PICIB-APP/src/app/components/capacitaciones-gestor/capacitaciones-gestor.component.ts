import { Component, ViewChild } from '@angular/core';
import { Capacitacion } from 'src/app/model/capacitacion.model';
import { NotificacionesPushComponent } from '../notificaciones-push/notificaciones-push.component';
import { CapacitacionesService } from 'src/app/services/capacitaciones.service';
import { Notificacion } from 'src/app/model/notificaciones.model';
import { Resultado } from 'src/app/model/resultado.model';
import { CursosService } from 'src/app/services/cursos.service';
import { PortalesService } from 'src/app/services/portales.service';
import { Curso } from 'src/app/model/curso.model';
import { InstitucionesService } from 'src/app/services/instituciones.service';

@Component({
  selector: 'app-capacitaciones-gestor',
  templateUrl: './capacitaciones-gestor.component.html',
  styleUrls: ['./capacitaciones-gestor.component.css'],
})
export class CapacitacionesGestorComponent {
  isVisibleFormularioCapacitaciones = false;
  capacitacionEditarSeleccionado: Capacitacion;
  @ViewChild('notificacion') notificacionHide: NotificacionesPushComponent;
  public capacitaciones: Capacitacion[] = [];
  constructor(private capacitacionesServices: CapacitacionesService, private cursosServices: CursosService, private portalService: PortalesService , private institucionServices: InstitucionesService) {
    this.capacitacionEditarSeleccionado = {};
  }
  ngOnInit(): void {
    this.capacitacionesServices
      .getCapacitaciones()
      .subscribe((capacitaciones) => {
        this.capacitaciones = capacitaciones;
        this.consultarRelaciones();
      });


  }

   consultarRelaciones(){
   this.capacitaciones.map( capacitacion =>{
        this.obtenerCurso(capacitacion.curso?.id!).then( curso =>
          capacitacion.curso =curso )
        this.obtenerInstitucion(capacitacion.institucion?.id!).then(institucion=> capacitacion.institucion=  institucion)
        this.obtenerPortal(capacitacion.horario?.portal?.id!).then(portal => {

          if (capacitacion.horario && capacitacion.horario.portal) {
            capacitacion.horario.portal = portal
          }

        });
      return capacitacion
    });


  }
  async deleteCapacitacion(capacitacion: Capacitacion) {
    try {
      const response = await this.capacitacionesServices.deleteCapacitacion(
        capacitacion
      );
      this.resultadoFormularioCapacitacion({
        mensage: 'Se elimino correctamente el capacitacion',
        result: true,
        response: response,
      });
    } catch (error) {
      this.resultadoFormularioCapacitacion({
        mensage: 'No se pudo eliminar el capacitacion',
        result: false,
        response: error,
      });
    }
  }

  selectCapacitacionEditar(capacitacion: Capacitacion) {
    this.isVisibleFormularioCapacitaciones = true;
    this.capacitacionEditarSeleccionado = capacitacion;
  }

  onFormularioCapacitacionHide(isVisible: boolean) {
    this.isVisibleFormularioCapacitaciones = isVisible;
  }
  showChild() {
    this.capacitacionEditarSeleccionado = {
      curso:{
        id: ''
      },
      institucion: {
        id: ''
      },
      horario: {
        fechaFin: new Date(),
        fechaInicio:new Date(),
        portal: {
          id: ''
        }
      },
      estado: false,
    };
    this.isVisibleFormularioCapacitaciones = true;
  }

  mostrarNotificacion() {
    this.notificacionHide.showNotificacion = true;
    setTimeout(() => {
      this.notificacionHide.showNotificacion = false;
    }, 3000);
  }

  resultadoFormularioCapacitacion(result: Resultado) {
    this.notificacionHide.mensajeNotificacion = result.mensage;
    if (result.result) {
      this.notificacionHide.typeNotificacion = Notificacion.SUCCESS;
    } else {
      this.notificacionHide.typeNotificacion = Notificacion.WARNING;
    }
    this.mostrarNotificacion();
  }

   async obtenerCurso(idCurso: string){

    return  await this.cursosServices.getCurso(idCurso);
  }

  async obtenerInstitucion(idInstitucion: string){

    return  await this.institucionServices.getInstitucion(idInstitucion);
  }

  async obtenerPortal(idPortal: string){

    return  await this.portalService.getPortal(idPortal);
  }


}
