import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import { Subscription, map } from 'rxjs';
import { Inscripcion } from 'src/app/model/inscripcion.model';
import { CapacitacionesService } from 'src/app/services/capacitaciones.service';
import { CursosService } from 'src/app/services/cursos.service';
import { EstudiantesService } from 'src/app/services/estudiantes.service';
import { InscripcionService } from 'src/app/services/inscripcion.service';
import { InstitucionesService } from 'src/app/services/instituciones.service';
import { PortalesService } from 'src/app/services/portales.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
})
export class ReportesComponent implements OnInit {
  private inscripcionesTodas: Inscripcion[];
  inscripcionesFiltradas: Inscripcion[];
  private observador$: Subscription;

  filtroFechaInicio: Date;
  filtroFechaFin: Date;
  filtroPortal: string;
  filtroLocalidad: string;
  filtroInstitucion: string;
  filtroCurso: string;

  opcionesPortalesFiltro: string[];
  opcionesLocalidesFiltro: string[];
  opcionesInstitucionesFiltro: string[];
  opcioneCursosFiltro: string[];

  constructor(
    private inscripcionesService: InscripcionService,
    private estudianteService: EstudiantesService,
    private capacitacionService: CapacitacionesService,
    private institucionService: InstitucionesService,
    private portalService: PortalesService,
    private cursoService: CursosService
  ) {}
  ngOnDestroy(): void {
    if (this.observador$) {
      this.observador$.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.observador$ = this.inscripcionesService
      .getInscripciones()
      .pipe(
        map(async (inscripciones) => {
          const parseInscripcion = inscripciones as Inscripcion[];
          return parseInscripcion.map(async (inscripcion) => {
            inscripcion.estudiante = await this.estudianteService.getEstudiante(
              inscripcion.estudiante?.id!
            );

            return inscripcion;
          });
        })
      )
      .subscribe(async (inscripciones) => {
        inscripciones.then((arrayInscripciones) => {
          Promise.all(arrayInscripciones).then((todas) => {
            this.inscripcionesTodas = todas;
            this.consultarRelaciones();
          });
        });
      });
  }

  private consultarRelaciones() {
    Promise.all(
      this.inscripcionesTodas.map(async (inscripcion) => {
        if (inscripcion.capacitacion?.id) {
          const capacitacion = await this.capacitacionService.getCapacitacion(
            inscripcion.capacitacion?.id
          );
          inscripcion.capacitacion = capacitacion;
          if (inscripcion.capacitacion.curso?.id) {
            const curso = await this.cursoService.getCurso(
              inscripcion.capacitacion.curso?.id
            );
            inscripcion.capacitacion.curso = curso;
          }
          if (inscripcion.capacitacion.horario?.portal?.id) {
            const portal = await this.portalService.getPortal(
              inscripcion.capacitacion.horario?.portal?.id
            );
            inscripcion.capacitacion.horario.portal = portal;
          }

          if (inscripcion.capacitacion.institucion?.id) {
            const institucion = await this.institucionService.getInstitucion(
              inscripcion.capacitacion.institucion?.id
            );
            inscripcion.capacitacion.institucion = institucion;
          }
        }
      })
    ).then(() => {
      this.inscripcionesFiltradas = this.inscripcionesTodas;
      this.opcionesFiltros();
    });
  }

  private opcionesFiltros() {
    this.opcionesPortalesFiltro = [
      ...new Set(
        this.inscripcionesFiltradas.map((inscripcion) => {
          return inscripcion.capacitacion?.horario?.portal?.nombre ?? '';
        })
      ),
    ];

    this.opcioneCursosFiltro = [
      ...new Set(
        this.inscripcionesFiltradas.map((intitucion) => {
          return intitucion.capacitacion?.curso?.nombre ?? '';
        })
      ),
    ];

    this.opcionesInstitucionesFiltro = [
      ...new Set(
        this.inscripcionesFiltradas.map((intitucion) => {
          return intitucion.capacitacion?.institucion?.nombre ?? '';
        })
      ),
    ];

    this.opcionesLocalidesFiltro = [
      ...new Set(
        this.inscripcionesFiltradas.map((inscripcion) => {
          return inscripcion.estudiante?.localidad ?? '';
        })
      ),
    ];
  }

  filtrarFechaInicio() {
    this.inscripcionesFiltradas = this.inscripcionesFiltradas.filter(
      (inscripcion) => {
        if (inscripcion.creadoEn) {
          return (
            new Date(inscripcion.creadoEn) >= new Date(this.filtroFechaInicio)
          );
        } else {
          return false;
        }
      }
    );
  }

  filtrarFechaFin() {
    this.inscripcionesFiltradas = this.inscripcionesFiltradas.filter(
      (inscripcion) => {
        if (inscripcion.creadoEn) {
          return (
            new Date(inscripcion.creadoEn) <= new Date(this.filtroFechaFin)
          );
        } else {
          return false;
        }
      }
    );
  }

  filtrarPortal() {
    this.inscripcionesFiltradas = this.inscripcionesFiltradas.filter(
      (inscripcion) => {
        return inscripcion.capacitacion?.horario?.portal?.nombre?.includes(
          this.filtroPortal
        );
      }
    );
    this.opcionesFiltros();
  }
  filtrarLocalidad() {

    this.inscripcionesFiltradas = this.inscripcionesFiltradas.filter(
      (inscripcion) => {
        return inscripcion.estudiante?.localidad?.includes(
          this.filtroLocalidad
        );
      }
    );
    this.opcionesFiltros();
  }
  filtrarCurso() {
    this.inscripcionesFiltradas = this.inscripcionesFiltradas.filter(
      (inscripcion) => {
        return inscripcion.capacitacion?.curso?.nombre?.includes(
          this.filtroCurso
        );
      }
    );
    this.opcionesFiltros();
  }
  filtrarInstitucion() {
    this.inscripcionesFiltradas = this.inscripcionesFiltradas.filter(
      (inscripcion) => {
        return inscripcion.capacitacion?.institucion?.nombre?.includes(
          this.filtroInstitucion
        );
      }
    );
    this.opcionesFiltros();
  }

  refreshFiltros() {
    this.inscripcionesFiltradas = this.inscripcionesTodas;
    this.opcionesFiltros();
    this.filtroLocalidad = '';
    this.filtroPortal = '' ;
    this.filtroInstitucion = '';
    this.filtroCurso = '';
    this.filtroFechaFin = new Date();
    this.filtroFechaInicio = new Date();

  }

  imprimirReportes() {
    let printContents = document.getElementById('graficas-contenedor');

    if (printContents) {
      var width = printContents.clientWidth + 100;
      var height = printContents.clientHeight + 100;

      const pdf = new jsPDF({
        orientation: 'l',
        unit: 'px',
        hotfixes: ['px_scaling'],
        format: [width, height],
      });
      pdf.text('Graficas PICIB',(width/2)-20, 30)
      pdf.html(printContents, {
        callback: function (doc) {
          doc.save('reporte2.pdf');
        },
        x: 50,
        y: 60,
      });
    }
  }
}
