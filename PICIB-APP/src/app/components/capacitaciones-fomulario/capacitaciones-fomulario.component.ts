import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Institucion } from 'src/app/model/Institucion.model';
import { Capacitacion } from 'src/app/model/capacitacion.model';
import { Curso } from 'src/app/model/curso.model';
import { Portal } from 'src/app/model/portal.mode';
import { Resultado } from 'src/app/model/resultado.model';
import { CapacitacionesService } from 'src/app/services/capacitaciones.service';
import { CursosService } from 'src/app/services/cursos.service';
import { InstitucionesService } from 'src/app/services/instituciones.service';
import { PortalesService } from 'src/app/services/portales.service';

@Component({
  selector: 'app-capacitaciones-fomulario',
  templateUrl: './capacitaciones-fomulario.component.html',
  styleUrls: ['./capacitaciones-fomulario.component.css'],
})
export class CapacitacionesFomularioComponent implements OnInit {
  @Output() onHide = new EventEmitter<boolean>();
  @Output() resultFormulario = new EventEmitter<Resultado>();
  @Input() capacitacionEditar: Capacitacion = {};
  isVisible = true;
  formularioCapacitacion: FormGroup;

  opcionesCursos: Curso[];
  selectedCurso: string = '';
  selectedCursoObject: Curso | undefined = {};

  opcionesInsituciones: Institucion[];
  selectedInstitucion: string = '';
  selectedInstitucionObject: Institucion | undefined = {};

  opcionesPortales: Portal[];
  selectedPortal: string = '';
  selectedPortalObject: Portal | undefined = {};

  constructor(
    private capacitacionsService: CapacitacionesService,
    private cursosServices: CursosService,
    private institucionService: InstitucionesService,
    private portalesService: PortalesService
  ) {
    this.formularioCapacitacion = new FormGroup({
      curso: new FormGroup({
        id: new FormControl('', Validators.required),
      }),
      institucion: new FormGroup({
        id: new FormControl('', Validators.required),
      }),
      horario: new FormGroup({
        fechaInicio: new FormControl('', Validators.required),
        fechaFin: new FormControl('', Validators.required),
        portal: new FormGroup({
          id: new FormControl('', Validators.required),
        }),
      }),
      cantidadMaximaInscritos: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.pattern('[0-9]+'),
      ]),
      estado: new FormControl(false, Validators.required),
    });
  }
  ngOnInit(): void {
    this.cursosServices.getCursos().subscribe((cursos) => {
      this.opcionesCursos = cursos.filter((curso) => curso.estado);

      this.establecerValorCursoEditar(cursos);
    });

    this.institucionService.getInstituciones().subscribe((instituciones) => {
      this.opcionesInsituciones = instituciones.filter(
        (instituciones) => instituciones.estado
      );
      this.establecerValorInstitucionEditar(instituciones);
    });

    this.portalesService.getPortales().subscribe((portales) => {
      this.opcionesPortales = portales.filter((portal) => portal.estado);
      this.establecerValorPortalEditar(portales);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['capacitacionEditar']) {
      this.formularioCapacitacion
        .get('estado')
        ?.setValue(changes['capacitacionEditar'].currentValue.estado);
      this.formularioCapacitacion
        .get('cantidadMaximaInscritos')
        ?.setValue(
          changes['capacitacionEditar'].currentValue.cantidadMaximaInscritos
        );
      this.formularioCapacitacion
        .get('horario.fechaInicio')
        ?.setValue(
          changes['capacitacionEditar'].currentValue.horario.fechaInicio
        );
      this.formularioCapacitacion
        .get('horario.fechaFin')
        ?.setValue(changes['capacitacionEditar'].currentValue.horario.fechaFin);
    }
  }

  private establecerValorCursoEditar(cursos: Curso[]) {
    if (this.capacitacionEditar.id) {
      const cursoSelecionadoEditar = cursos.find(
        (course) => course.id == this.capacitacionEditar.curso?.id
      );
      this.selectedCurso = cursoSelecionadoEditar?.nombre ?? '';

      this.formularioCapacitacion
        .get('curso.id')
        ?.setValue(cursoSelecionadoEditar?.id);
    }
  }

  private establecerValorPortalEditar(portales: Portal[]) {
    if (this.capacitacionEditar.id) {
      const portalSelecionadoEditar = portales.find(
        (portal) => portal.id == this.capacitacionEditar.horario?.portal?.id
      );
      this.selectedPortal = portalSelecionadoEditar?.nombre ?? '';
      this.formularioCapacitacion
        .get('horario.portal.id')
        ?.setValue(portalSelecionadoEditar?.id);
    }
  }

  private establecerValorInstitucionEditar(instituciones: Institucion[]) {
    if (this.capacitacionEditar.id) {
      const institucionSelecionadaEditar = instituciones.find(
        (institucion) =>
          institucion.id == this.capacitacionEditar.institucion?.id
      );
      this.selectedInstitucion = institucionSelecionadaEditar?.nombre ?? '';
      this.formularioCapacitacion
        .get('institucion.id')
        ?.setValue(institucionSelecionadaEditar?.id);
    }
  }

  hide() {
    this.isVisible = false;
    this.onHide.emit(this.isVisible);
  }

  async onSubmit() {
    try {
      let response;
      if (this.capacitacionEditar.id) {
        response = await this.capacitacionsService.updateDocument({
          id: this.capacitacionEditar.id,
          ...this.formularioCapacitacion.value,
        });
      } else {
        response = await this.capacitacionsService.addCapacitacion(
          this.formularioCapacitacion.value
        );
      }
      this.resultFormulario.emit({
        mensage: 'Se guardo correctamente',
        result: true,
        response: response,
      });
      this.hide();
    } catch (error) {
      this.resultFormulario.emit({
        mensage: 'No se pudo guardar los cambios',
        result: false,
        response: error,
      });
    }
  }

  get nombre() {
    return this.formularioCapacitacion.get('nombre');
  }

  get ubicacion() {
    return this.formularioCapacitacion.get('ubicacion');
  }

  get horariosAtencion() {
    return this.formularioCapacitacion.get('horariosAtencion');
  }

  onChangeCurso() {
    this.selectedCursoObject = this.opcionesCursos?.find(
      (curso) => curso.nombre == this.selectedCurso
    );

    this.formularioCapacitacion
      .get('curso.id')
      ?.setValue(this.selectedCursoObject?.id);
  }

  onChangeInstitucion() {
    this.selectedInstitucionObject = this.opcionesInsituciones?.find(
      (institucion) => institucion.nombre == this.selectedInstitucion
    );
    this.formularioCapacitacion
      .get('institucion.id')
      ?.setValue(this.selectedInstitucionObject?.id);
  }

  onChangePortal() {
    this.selectedPortalObject = this.opcionesPortales?.find(
      (portal) => portal.nombre == this.selectedPortal
    );
    this.formularioCapacitacion
      .get('horario.portal.id')
      ?.setValue(this.selectedPortalObject?.id);
  }

  get curso() {
    return this.formularioCapacitacion.get('curso.id');
  }

  get institucion() {
    return this.formularioCapacitacion.get('institucion.id');
  }

  get portal() {
    return this.formularioCapacitacion.get('horario.portal.id');
  }
}
