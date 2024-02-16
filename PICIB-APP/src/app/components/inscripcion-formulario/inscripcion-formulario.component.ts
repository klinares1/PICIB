import { formatDate } from '@angular/common';
import { Component, OnDestroy, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Capacitacion } from 'src/app/model/capacitacion.model';
import { Estudiante } from 'src/app/model/usuarios.model';
import { CapacitacionesService } from 'src/app/services/capacitaciones.service';
import { CursosService } from 'src/app/services/cursos.service';
import { EstudiantesService } from 'src/app/services/estudiantes.service';
import { InscripcionService } from 'src/app/services/inscripcion.service';
import { InstitucionesService } from 'src/app/services/instituciones.service';
import { PortalesService } from 'src/app/services/portales.service';
import { NotificacionesPushComponent } from '../notificaciones-push/notificaciones-push.component';
import { Resultado } from 'src/app/model/resultado.model';
import { Notificacion } from 'src/app/model/notificaciones.model';
import { CorreoService } from 'src/app/services/correo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-inscripcion-formulario',
  templateUrl: './inscripcion-formulario.component.html',
  styleUrls: ['./inscripcion-formulario.component.css'],
})
export class InscripcionFormularioComponent implements OnDestroy {
  @ViewChild('notificacion') notificacionHide: NotificacionesPushComponent;

  public capacitaciones: Capacitacion[] = [];
  public capacitacionesFilter: Capacitacion[] = [];
  formularioInscripcion: FormGroup;
  formularioInscripcionCurso: FormGroup;
  formularioInscripcionBusqueda: FormGroup;

  private registrarParticipante: boolean;
  private registrarCurso: boolean;
  private finalizoRegistro: boolean;

  selectedCapacitacion: string = '';
  selectedCapacitacionObject: Capacitacion;

  selectedCapacitacionPortal: string = '';

  tipoDocumentos: string[] = ['T.I', 'C.C'];

  private observadorCapacitaciones$: Subscription;

  private lastSubmitEstudiante: Estudiante;
  opcionesLocalidad: string[] = [
    'USAQUÉN',
    'CHAPINERO',
    'SANTA FE',
    'SAN CRISTOBAL',
    'USME',
    'TUNJUELITO',
    'BOSA',
    'KENNEDY CENTRAL',
    'KENNEDY AMÉRICAS',
    'FONTIBÓN',
    'ENGATIVÁ BOYACÁ REAL',
    'ENGATIVÁ CENTRO',
    'SUBA NIZA',
    'SUBA TIBABUYES',
    'BARRIOS UNIDOS',
    'TEUSAQUILLO',
    'LOS MÁRTIRES',
    'ANTONIO NARIÑO',
    'PUENTE ARANDA',
    'LA CANDELARIA',
    'RAFAEL URIBE URIBE',
    'CIUDAD BOLÍVAR',
  ];

  opcionesGenero = ['Masculino', 'Femenino', 'Otro'];

  constructor(
    private estudianteService: EstudiantesService,
    private inscripcionService: InscripcionService,
    private capacitacionesServices: CapacitacionesService,
    private cursosServices: CursosService,
    private portalService: PortalesService,
    private institucionServices: InstitucionesService
  ) {

    this.registrarCurso = false;
    this.registrarParticipante = false;
    this.finalizoRegistro = false;
    this.formularioInscripcion = new FormGroup({
      nombre: new FormControl('', Validators.required),
      correoElectronico: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      barrio: new FormControl('', Validators.required),
      genero: new FormControl('', [
        Validators.required,
        this.generoValidator(),
      ]),
      fechaNacimiento: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{4}-\d{2}-\d{2}$/),
      ]),
      documento: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('[0-9]*'),
      ]),
      tipoDocumento: new FormControl('', [
        Validators.required,
        this.tipoDocumentoValidator(),
      ]),
      lugarExpedicion: new FormControl('', Validators.required),
      localidad: new FormControl('', [
        Validators.required,
        this.tipoLocalidadValidator(),
      ]),
      ciudadResidencia: new FormControl('', Validators.required),
      estado: new FormControl(false),
      gradoEscolaridad: new FormControl('', Validators.required),
      numeroContacto: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{10}$/),
      ]),
      nombrePersonaContacto:new FormControl('', Validators.required),
      numeroPersonaContacto: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{10}$/),
      ])
    });

    this.formularioInscripcionBusqueda = new FormGroup({
      numeroDocumentoBusqueda: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('[0-9]*'),
      ]),
      fechaNacimientoBusqueda: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{4}-\d{2}-\d{2}$/),
      ]),
    });

    this.formularioInscripcionCurso = new FormGroup({
      capacitacion: new FormGroup({
        id: new FormControl('', Validators.required),
      }),
    });
  }
  ngOnDestroy(): void {
    if(this.observadorCapacitaciones$){
     this.observadorCapacitaciones$.unsubscribe();
    }
  }
  ngOnInit(): void {
   this.observadorCapacitaciones$ = this.capacitacionesServices
      .getCapacitaciones()
      .subscribe((capacitaciones) => {
        this.capacitaciones = capacitaciones;
        this.consultarRelaciones();
      });
  }

  async onSubmit() {
    try {
      let response;

      let estudianteExiste = await this.estudianteService.existeElStudiante(
        this.formularioInscripcion.value
      );

      if (!estudianteExiste) {
        this.lastSubmitEstudiante = await this.estudianteService.addEstudiante(
          this.formularioInscripcion.value
        );
        this.resultadoFormularioCurso({
          mensage: 'Se creo correctamente el participante',
          result: true,
          response: 'El participante se creo',
        });
        this.registrarCurso = true;
        this.registrarParticipante = false;
      } else {
        this.resultadoFormularioCurso({
          mensage: 'No se pudo crear el participante, ya existe',
          result: false,
          response: 'El participante ya existe',
        });
      }
    } catch (error) {
      this.resultadoFormularioCurso({
        mensage: 'No se pudo crear el participante, error desconocido',
        result: false,
        response: 'Error de registro',
      });
    }
  }

  async onSubmitBusqueda() {
    const participante = await this.estudianteService.existeElEstudiante({
      fechaNacimiento: this.formularioInscripcionBusqueda.get(
        'fechaNacimientoBusqueda'
      )?.value,
      documento: this.formularioInscripcionBusqueda.get(
        'numeroDocumentoBusqueda'
      )?.value,
    });

    const participanteDoc = await this.estudianteService.existeElStudiante({
      documento: this.formularioInscripcionBusqueda.get(
        'numeroDocumentoBusqueda'
      )?.value,
    });

    if (participante != null) {
      const inscripciones =
        await this.inscripcionService.cantidadInscripcionesEstudiante({
          estudiante: { id: participante?.id },
        });

      if (inscripciones?.length && inscripciones?.length >= 2) {
        this.resultadoFormularioCurso({
          result: false,
          mensage:
            'No se puede registrar en mas capacitaciones, actualmente tiene ' +
            inscripciones?.length +
            ' capacitaciones activas',
          response: 'No se pudo registrar',
        });
      } else {
        this.registrarCurso = true;
        if (participante) {
          this.lastSubmitEstudiante = participante;
        }
      }
    } else if (participanteDoc != null) {
      this.resultadoFormularioCurso({
        result: false,
        mensage: 'El participante ya existe',
        response: 'No se pudo registrar',
      });
    } else {
      this.registrarParticipante = true;
      this.formularioInscripcion.get('documento')?.setValue(this.formularioInscripcionBusqueda.get(
        'numeroDocumentoBusqueda'
      )?.value)
      this.formularioInscripcion.get('fechaNacimiento')?.setValue(this.formularioInscripcionBusqueda.get('fechaNacimientoBusqueda')?.value)
    }
  }

  async onSubmitCurso() {
    const existeCapacitacion = await this.inscripcionService.existeInscripcion({
      capacitacion: {
        id: this.formularioInscripcionCurso.get('capacitacion.id')?.value,
      },
      estudiante: {
        id: this.lastSubmitEstudiante.id,
      },
    });

    if (!existeCapacitacion) {
      const inscripcion = await this.inscripcionService.addInscripcion({
        estudiante: { id: this.lastSubmitEstudiante?.id },
        capacitacion: {
          id:
            this.formularioInscripcionCurso?.get('capacitacion.id')?.value ??
            '',
        },

        estado: true,
      });

      this.resultadoFormularioCurso({
        result: true,
        mensage: 'Se registro correctamente',
        response: inscripcion,
      });
      this.formularioInscripcion.reset();
      this.finalizoRegistro = true;
      this.registrarParticipante = false;
      this.registrarCurso = false;
    } else {
      this.resultadoFormularioCurso({
        result: false,
        mensage: 'Ya se registro en la capacitación',
        response: 'No se pudo registrar',
      });
    }
  }

  async consultarRelaciones() {
    return await this.capacitaciones.map(async (capacitacion) => {
      capacitacion.curso = await this.obtenerCurso(capacitacion.curso?.id!);

      capacitacion.institucion = await this.obtenerInstitucion(
        capacitacion.institucion?.id!
      );

      if (capacitacion.horario && capacitacion.horario.portal) {
        capacitacion.horario.portal = await this.obtenerPortal(
          capacitacion.horario?.portal?.id!
        );
      }

      return capacitacion;
    });
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

  onChangeCapacitacion() {
    this.selectedCapacitacionObject = this.capacitaciones?.find(
      (capacitacion) => capacitacion.curso?.nombre == this.selectedCapacitacion
    ) as Capacitacion;
    this.formularioInscripcionCurso
      .get('capacitacion.id')
      ?.setValue(this.selectedCapacitacionObject?.id);
  }

  onChangeCapacitacionPortal() {
    if (this.selectedCapacitacionPortal != '') {
      this.capacitacionesFilter = this.capacitaciones.filter((cap) => {
        return cap.horario?.portal?.nombre?.includes(
          this.selectedCapacitacionPortal
        );
      });
    }
  }

  formatDateHorario(fechaA: Date, fechaB: Date) {
    return (
      formatDate(fechaA, 'mediumDate', 'es-ES') +
      ' - ' +
      fechaB.toLocaleString('en-US')
    );
  }

  mostrarNotificacion() {
    this.notificacionHide.showNotificacion = true;
    setTimeout(() => {
      this.notificacionHide.showNotificacion = false;
    }, 3000);
  }

  resultadoFormularioCurso(result: Resultado) {
    this.notificacionHide.mensajeNotificacion = result.mensage;
    if (result.result) {
      this.notificacionHide.typeNotificacion = Notificacion.SUCCESS;
    } else {
      this.notificacionHide.typeNotificacion = Notificacion.WARNING;
    }
    this.mostrarNotificacion();
  }

  generoValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      return !this.opcionesGenero.includes(value)
        ? { invalidGenero: true }
        : null;
    };
  }

  tipoDocumentoValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      return !this.tipoDocumentos.includes(value)
        ? { invalidTipoDocumento: true }
        : null;
    };
  }

  tipoLocalidadValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      return !this.opcionesLocalidad.includes(value)
        ? { invalidLocalidad: true }
        : null;
    };
  }

  get localidad() {
    return this.formularioInscripcion.get('localidad');
  }
  get documento() {
    return this.formularioInscripcion.get('documento');
  }

  get documentoBusqueda() {
    return this.formularioInscripcionBusqueda.get('numeroDocumentoBusqueda');
  }

  get tipoDocumento() {
    return this.formularioInscripcion.get('tipoDocumento');
  }

  get correoElectronico() {
    return this.formularioInscripcion.get('correoElectronico');
  }

  get numeroContacto() {
    return this.formularioInscripcion.get('numeroContacto');
  }

  get fechaNacimiento() {
    return this.formularioInscripcion.get('fechaNacimiento');
  }

  get fechaNacimientoBusqueda() {
    return this.formularioInscripcionBusqueda.get('fechaNacimientoBusqueda');
  }

  get barrio() {
    return this.formularioInscripcion.get('barrio');
  }

  get nombre() {
    return this.formularioInscripcion.get('nombre');
  }

  get capacitacion() {
    return this.formularioInscripcion.get('capacitacion.id');
  }

  get numeroPersonaContacto() {
    return this.formularioInscripcion.get('numeroPersonaContacto');
  }


  get nombrePersonaContacto() {
    return this.formularioInscripcion.get('nombrePersonaContacto');
  }


  get registrarParticipanteFormulario() {
    return this.registrarParticipante;
  }

  get registrarCursoFormulario() {
    return this.registrarCurso;
  }

  get finalizoRegistroShow() {
    return this.finalizoRegistro;
  }
}
