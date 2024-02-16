import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Institucion } from 'src/app/model/Institucion.model';
import { Resultado } from 'src/app/model/resultado.model';
import { InstitucionesService } from 'src/app/services/instituciones.service';

@Component({
  selector: 'app-instituciones-formulario',
  templateUrl: './instituciones-formulario.component.html',
  styleUrls: ['./instituciones-formulario.component.css'],
})
export class InstitucionesFormularioComponent {
  @Output() onHide = new EventEmitter<boolean>();
  @Output() resultFormulario = new EventEmitter<Resultado>();
  @Input() institucionEditar: Institucion = {};
  isVisible = true;
  formularioInstitucion: FormGroup;

  constructor(private institucionesService: InstitucionesService) {
    this.formularioInstitucion = new FormGroup({
      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      contacto: new FormGroup({
        nombre: new FormControl(''),
        numeroContacto:  new FormControl('',  [Validators.required, Validators.pattern(/^\d{10}$/)]),
        correoElectronico:  new FormControl('', [
          Validators.required,
          Validators.email,
        ]),
      }),
      estado: new FormControl(false),
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['institucionEditar']) {
      this.formularioInstitucion.setValue({
        nombre: changes['institucionEditar'].currentValue.nombre,
        estado: changes['institucionEditar'].currentValue.estado,
        contacto: {
          nombre: changes['institucionEditar'].currentValue.contacto?.nombre ?? '',
          numeroContacto: changes['institucionEditar'].currentValue.contacto?.numeroContacto ?? '',
          correoElectronico:changes['institucionEditar'].currentValue.contacto?.correoElectronico ??''
        }
      });
    }
  }

  hide() {
    this.isVisible = false;
    this.onHide.emit(this.isVisible);
  }

  async onSubmit() {
    try {
      let response;
      this.hide();
      if (this.institucionEditar.id) {

        response = await this.institucionesService.updateDocument({
          id: this.institucionEditar.id,
          ...this.formularioInstitucion.value,
        }).then(()=>{
          this.resultFormulario.emit({
            mensage: 'Se actualizo correctamente la institucion',
            result: true,
            response: {},
          });
        });
      } else {

        response = await this.institucionesService.addInstitucion(
          this.formularioInstitucion.value
        ).then((data)=>{
          this.resultFormulario.emit({
            mensage: 'Se guardo correctamente la institución',
            result: true,
            response: data,
          });

        });
      }

    } catch (error) {
      this.resultFormulario.emit({
        mensage: 'No se pudo guardar los cambios',
        result: false,
        response: error,
      });
    }
  }

  get nombre() {
    return this.formularioInstitucion.get('nombre');
  }

  get contactoNombre() {
    return this.formularioInstitucion.get('contacto.nombre');
  }

  get contactoNumero() {
    return this.formularioInstitucion.get('contacto.numeroContacto');
  }

  get contactoCorreoElectronico() {
    return this.formularioInstitucion.get('contacto.correoElectronico');
  }
}
