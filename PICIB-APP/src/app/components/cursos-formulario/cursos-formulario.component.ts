import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Curso } from 'src/app/model/curso.model';
import { Resultado } from 'src/app/model/resultado.model';
import { CursosService } from 'src/app/services/cursos.service';

@Component({
  selector: 'app-cursos-formulario',
  templateUrl: './cursos-formulario.component.html',
  styleUrls: ['./cursos-formulario.component.css'],
})
export class CursosFormularioComponent implements OnChanges {
  @Output() onHide = new EventEmitter<boolean>();
  @Output() resultFormulario = new EventEmitter<Resultado>();
  @Input() cursoEditar: Curso = {};
  isVisible = true;
  formularioCurso: FormGroup;

  constructor(private cursosService: CursosService) {
    this.formularioCurso = new FormGroup({
      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      descripcion: new FormControl(''),
      estado: new FormControl(false),
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cursoEditar']) {
      this.formularioCurso.setValue({
        nombre: changes['cursoEditar'].currentValue.nombre,
        descripcion: changes['cursoEditar'].currentValue.descripcion,
        estado: changes['cursoEditar'].currentValue.estado,
      });
    }
  }

  hide() {
    this.isVisible = false;
    this.onHide.emit(this.isVisible);
  }

  async onSubmit() {
    try {
      const cursoExiste = await this.cursosService.getCursoPorNombre(
        this.formularioCurso.get('nombre')?.value
      );
      if (!cursoExiste?.id) {
        let response;
        if (this.cursoEditar.id) {
          response = await this.cursosService.updateDocument({
            id: this.cursoEditar.id,
            ...this.formularioCurso.value,
          });
        } else {
          response = await this.cursosService.addCurso(
            this.formularioCurso.value
          );
        }
        this.resultFormulario.emit({
          mensage: 'Se guardo correctamente',
          result: true,
          response: response,
        });
        this.hide();
      }else{
        this.resultFormulario.emit({
          mensage: 'El curso ya existe',
          result: false,
          response: cursoExiste,
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

  esElMismoActualizar(): boolean{
    if(this.cursoEditar.nombre){
      if(this.formularioCurso.get("nombre")?.value == this.cursoEditar.nombre &&
      this.formularioCurso.get("descripcion")?.value == this.cursoEditar.descripcion &&
      this.formularioCurso.get("estado")?.value == this.cursoEditar.estado
      ){
        return false;
      }else{
        return true;
      }
    }else{
      return true;
    }



    return true;
  }

  get nombre() {
    return this.formularioCurso.get('nombre');
  }


}
