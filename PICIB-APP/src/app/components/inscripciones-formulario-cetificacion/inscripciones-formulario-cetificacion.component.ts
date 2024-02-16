import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Inscripcion } from 'src/app/model/inscripcion.model';
import { Resultado } from 'src/app/model/resultado.model';
import { InscripcionService } from 'src/app/services/inscripcion.service';

@Component({
  selector: 'app-inscripciones-formulario-cetificacion',
  templateUrl: './inscripciones-formulario-cetificacion.component.html',
  styleUrls: ['./inscripciones-formulario-cetificacion.component.css']
})
export class InscripcionesFormularioCetificacionComponent {
  @Output() onHide = new EventEmitter<boolean>();
  @Output() resultFormulario = new EventEmitter<Resultado>();
  @Input() inscripcionCertificacion: Inscripcion = {};
  isVisible = true;
  formularioCertificacion: FormGroup;

  constructor(private inscripcionService: InscripcionService) {
    this.formularioCertificacion = new FormGroup({
      estado: new FormControl('', [
        Validators.required,
      ]),
      comentario: new FormControl(''),

    });
  }
  // ngOnChanges(changes: SimpleChanges): void {
  //   // if (changes['cursoEditar']) {
  //   //   this.formularioCurso.setValue({
  //   //     nombre: changes['cursoEditar'].currentValue.nombre,
  //   //     descripcion: changes['cursoEditar'].currentValue.descripcion,
  //   //     estado: changes['cursoEditar'].currentValue.estado,
  //   //   });
  //   // }
  // }

  hide() {
    this.isVisible = false;
    this.onHide.emit(this.isVisible);
  }

  async onSubmit() {
    try {

      this.inscripcionService.guardarCertificacion(this.inscripcionCertificacion, {...this.formularioCertificacion.value, fecha: Date.now() } )

        this.resultFormulario.emit({
          mensage: 'Se guardo correctamente',
          result: true,
          response: null,
        });
        this.hide();

      }
     catch (error) {
      this.resultFormulario.emit({
        mensage: 'No se pudo guardar los cambios',
        result: false,
        response: error,
      });
    }
  }



  get estado() {
    return this.formularioCertificacion.get('estado');
  }


}
