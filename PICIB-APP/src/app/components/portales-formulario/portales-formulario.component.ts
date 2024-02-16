import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Portal } from 'src/app/model/portal.mode';
import { Resultado } from 'src/app/model/resultado.model';
import { PortalesService } from 'src/app/services/portales.service';

@Component({
  selector: 'app-portales-formulario',
  templateUrl: './portales-formulario.component.html',
  styleUrls: ['./portales-formulario.component.css'],
})
export class PortalesFormularioComponent {
  @Output() onHide = new EventEmitter<boolean>();
  @Output() resultFormulario = new EventEmitter<Resultado>();
  @Input() portalEditar: Portal = {};
  isVisible = true;
  formularioPortal: FormGroup;

  constructor(private portalsService: PortalesService) {
    this.formularioPortal = new FormGroup({
      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      horariosAtencion: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      ubicacion: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      estado: new FormControl(false),
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['portalEditar']) {
      this.formularioPortal.setValue({
        nombre: changes['portalEditar'].currentValue.nombre,
        horariosAtencion: changes['portalEditar'].currentValue.horariosAtencion,
        ubicacion: changes['portalEditar'].currentValue.ubicacion,
        estado: changes['portalEditar'].currentValue.estado,
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
      if (this.portalEditar.id) {
        response = await this.portalsService.updateDocument({
          id: this.portalEditar.id,
          ...this.formularioPortal.value,
        });
      } else {
        response = await this.portalsService.addPortal(
          this.formularioPortal.value
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
    return this.formularioPortal.get('nombre');
  }

  get ubicacion() {
    return this.formularioPortal.get('ubicacion');
  }

  get horariosAtencion() {
    return this.formularioPortal.get('horariosAtencion');
  }
}
