import { Component, OnInit, ViewChild } from '@angular/core';
import { Curso } from 'src/app/model/curso.model';
import { CursosService } from 'src/app/services/cursos.service';
import { NotificacionesPushComponent } from '../notificaciones-push/notificaciones-push.component';
import { Resultado } from 'src/app/model/resultado.model';
import { Notificacion } from 'src/app/model/notificaciones.model';

@Component({
  selector: 'app-cursos-gestor',
  templateUrl: './cursos-gestor.component.html',
  styleUrls: ['./cursos-gestor.component.css'],
})
export class CursosGestorComponent implements OnInit {
  isVisibleFormularioCursos = false;
  cursoEditarSeleccionado: Curso;
  @ViewChild('notificacion') notificacionHide: NotificacionesPushComponent;
  public cursos: Curso[] = [];
  constructor(private cursosServices: CursosService) {
    this.cursoEditarSeleccionado = {};
  }
  ngOnInit(): void {
    this.cursosServices.getCursos().subscribe((curso) => {
      this.cursos = curso;
    });
  }

  async deleteCurso(curso: Curso) {
    try {
      const response = await this.cursosServices.deleteCurso(curso);
      this.resultadoFormularioCurso({
        mensage: 'Se elimino correctamente el curso',
        result: true,
        response: response,
      });
    } catch (error) {
      this.resultadoFormularioCurso({
        mensage: 'No se pudo eliminar el curso',
        result: false,
        response: error,
      });
    }
  }

  selectCursoEditar(curso: Curso) {

    this.isVisibleFormularioCursos = true;
    this.cursoEditarSeleccionado = curso;
  }

  onFormularioCursoHide(isVisible: boolean) {
    this.isVisibleFormularioCursos = isVisible;
  }
  showChild() {
    this.cursoEditarSeleccionado = {
      nombre: '',
      descripcion: '',
      estado: false,
    };
    this.isVisibleFormularioCursos = true;
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
}
