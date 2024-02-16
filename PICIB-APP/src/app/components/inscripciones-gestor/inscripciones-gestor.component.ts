import { Component, ViewChild } from '@angular/core';
import { Inscripcion } from 'src/app/model/inscripcion.model';
import { NotificacionesPushComponent } from '../notificaciones-push/notificaciones-push.component';
import { InscripcionService } from 'src/app/services/inscripcion.service';
import { EstudiantesService } from 'src/app/services/estudiantes.service';
import { InstitucionesService } from 'src/app/services/instituciones.service';
import { PortalesService } from 'src/app/services/portales.service';
import { CursosService } from 'src/app/services/cursos.service';
import { CapacitacionesService } from 'src/app/services/capacitaciones.service';
import { Notificacion } from 'src/app/model/notificaciones.model';
import { Resultado } from 'src/app/model/resultado.model';
import { UserService } from 'src/app/services/user.service';
import { Usuario } from 'src/app/model/usuarios.model';

@Component({
  selector: 'app-inscripciones-gestor',
  templateUrl: './inscripciones-gestor.component.html',
  styleUrls: ['./inscripciones-gestor.component.css'],
})
export class InscripcionesGestorComponent {
  isVisibleFormularioInscripciones = false;
  isVisibleFormularioInscripcionesCertificar = false;
  inscripcionEditarSeleccionado: Inscripcion;
  inscripcionCertificar: Inscripcion;
  @ViewChild('notificacion') notificacionHide: NotificacionesPushComponent;

  private usuario: Usuario;

  private inscripciones: Inscripcion[] = [];
  public inscripcionesRenderizar: Inscripcion[] = [];
  constructor(
    private inscripcionesService: InscripcionService,
    private capacitacionesServices: CapacitacionesService,
    private cursosServices: CursosService,
    private portalService: PortalesService,
    private institucionServices: InstitucionesService,
    private estudianteService: EstudiantesService,
    private userService: UserService
  ) {
    this.inscripcionCertificar={};
   // this.capacitacionEditarSeleccionado = {};
  }

  ngOnInit(): void {
    this.inscripcionesService.getInscripciones().subscribe((inscripciones) => {
      this.inscripciones = inscripciones;
      this.consultarRelaciones();

    });

    this.userService.isLoggedInCallback(async user=>{
      if(user){
        const userDB = await this.userService.obtenerUsuarioPorCorreo(user.email!);
        if(userDB)
        this.usuario = userDB;
      }
    })
  }

   consultarRelaciones() {
   Promise.all(this.inscripciones.map(async (inscripcion) => {

    this.estudianteService.getEstudiante(inscripcion.estudiante?.id!).then(estudiante => inscripcion.estudiante = estudiante);



    inscripcion.capacitacion = await this.capacitacionesServices.getCapacitacion(inscripcion.capacitacion?.id!)
    if(inscripcion.capacitacion){

    const curso = await  this.obtenerCurso(inscripcion.capacitacion?.curso?.id!)
    inscripcion.capacitacion.curso = curso

    const institucion = await this.obtenerInstitucion(inscripcion.capacitacion.institucion?.id!)
    inscripcion.capacitacion.institucion =institucion;

    const portal = await this.obtenerPortal(inscripcion.capacitacion.horario?.portal?.id!)
      if(inscripcion.capacitacion.horario){
        inscripcion.capacitacion.horario.portal = portal
      }



    }

    return inscripcion
  })).then(inscripciones =>{

    this.inscripcionesRenderizar =inscripciones.filter((inscripcion) =>{

      if(this.usuario.rol == 'GUIATIC' ){

        return  inscripcion.capacitacion?.horario?.portal?.id == this.usuario.portal?.id;
      }else if(this.usuario.rol == 'ADMIN' ){
       return  true;
      }else{
        return false;
      }
    });
  })
  }
  async deleteInscripcion(inscripcion: Inscripcion) {
    try {
      const response = await this.inscripcionesService.deleteInscripcion(
        inscripcion
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

  selectInscripcionEditar(inscripcion: Inscripcion) {
    this.isVisibleFormularioInscripciones = true;
    this.inscripcionEditarSeleccionado = inscripcion;
  }


  selectInscripcionCertificar(inscripcion: Inscripcion) {
    this.isVisibleFormularioInscripcionesCertificar = true;
    this.inscripcionCertificar = inscripcion;
  }

  onFormularioInscripcionCertificarHide(isVisible: boolean) {
    this.isVisibleFormularioInscripcionesCertificar = isVisible;
  }

  // onFormularioCapacitacionHide(isVisible: boolean) {
  //   this.isVisibleFormularioCapacitaciones = isVisible;
  // }
  // showChild() {
  //   this.capacitacionEditarSeleccionado = {
  //     curso: {
  //       id: '',
  //     },
  //     institucion: {
  //       id: '',
  //     },
  //     horario: {
  //       fechaFin: new Date(),
  //       fechaInicio: new Date(),
  //       portal: {
  //         id: '',
  //       },
  //     },
  //     estado: false,
  //   };
  //   this.isVisibleFormularioCapacitaciones = true;
  // }

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

  async obtenerCurso(idCurso: string) {
    return await this.cursosServices.getCurso(idCurso);
  }

  async obtenerInstitucion(idInstitucion: string) {
    return await this.institucionServices.getInstitucion(idInstitucion);
  }

  async obtenerPortal(idPortal: string) {
    return await this.portalService.getPortal(idPortal);
  }

  get usuarioRole(){
    return this.usuario?.rol ?? 'USUARIO';
  }
}
