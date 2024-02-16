import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Observable, catchError, from, map, of } from 'rxjs';
import { Portal } from 'src/app/model/portal.mode';
import { Resultado } from 'src/app/model/resultado.model';
import { Usuario } from 'src/app/model/usuarios.model';
import { generaCadenaAleatoria } from 'src/app/model/utilidades';
import { PortalesService } from 'src/app/services/portales.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-usuarios-formulario',
  templateUrl: './usuarios-formulario.component.html',
  styleUrls: ['./usuarios-formulario.component.css'],
})
export class UsuariosFormularioComponent implements OnInit {
  @Output() onHide = new EventEmitter<boolean>();
  @Output() resultFormulario = new EventEmitter<Resultado>();
  @Input() usuarioEditar: Usuario = {};
  isVisible = true;
  formularioUsuario: FormGroup;
  tipoDocumentos: string[] = ['T.I', 'C.C'];
  roles = [
    { etiqueta: 'Administrador', valor: 'ADMIN' },
    { etiqueta: 'Guia Tic', valor: 'GUIATIC' },
  ];

  opcionesPortales: Portal[];
  selectedPortal: string = '';
  selectedPortalObject: Portal | undefined = {};

  constructor(
    private usuariosService: UserService,
    private portalesService: PortalesService
  ) {
    this.formularioUsuario = new FormGroup({
      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      tipoDocumento: new FormControl('', [
        Validators.required,
        this.tipoDocumentoValidator(),
      ]),
      correoElectronico: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      documento: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern('[0-9]*'),
      ]),
      rol: new FormControl(''),
      estado: new FormControl(false),
      portal: new FormGroup({
        id: new FormControl(),
      }),
    });
  }
  ngOnInit(): void {
    this.usuariosService.getUsuarios().subscribe((users) => {
      const usersGuiaTic = users
        .filter((user) => user.rol === 'GUIATIC' && user.portal?.id)
        .map((user) => user.portal?.id);
      this.portalesService.getPortales().subscribe((portales) => {
        this.opcionesPortales = portales.filter(
          (portal) => portal.estado && !usersGuiaTic.includes(portal.id)
        );
        this.establecerValorPortalEditar(portales);
      });
    });

    this.documento?.setAsyncValidators(this.existeDocumentoValidator());
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuarioEditar']) {
      this.formularioUsuario.setValue({
        nombre: changes['usuarioEditar'].currentValue.nombre ?? '',
        tipoDocumento:
          changes['usuarioEditar'].currentValue.tipoDocumento ?? '',
        correoElectronico:
          changes['usuarioEditar'].currentValue.correoElectronico ?? '',
        documento: changes['usuarioEditar'].currentValue.documento ?? '',
        rol: changes['usuarioEditar'].currentValue.rol ?? '',
        portal: {
          id: changes['usuarioEditar'].currentValue.portal?.id ?? '',
        },
        estado: changes['usuarioEditar'].currentValue.estado ?? '',
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
      if (this.usuarioEditar.id) {
        response = await this.usuariosService.updateUsuario({
          id: this.usuarioEditar.id,
          ...this.formularioUsuario.value,
        });
      } else {
        if (this.formularioUsuario.get('rol')?.value === 'ADMIN') {
          delete this.formularioUsuario.value.portal;
        }
        const existenciaPrevia =
          await this.usuariosService.obtenerUsuarioPorCorreo(
            this.formularioUsuario.get('correoElectronico')?.value
          );
        if (!existenciaPrevia) {
          response = await this.usuariosService.addUsuario(
            this.formularioUsuario.value
          );
          if (response) {
            this.usuariosService.register({
              email: this.formularioUsuario.get('correoElectronico')?.value,
              password: generaCadenaAleatoria(10),
            }).then((valor)=>{
              this.usuariosService.enviarEmailResetContrasenia(valor.user?.email ?? this.formularioUsuario.get('correoElectronico')?.value);
            }

            );
          }
        }
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

  private establecerValorPortalEditar(portales: Portal[]) {
    if (this.usuarioEditar.id) {
      const portalSelecionadoEditar = portales.find(
        (portal) => portal.id == this.usuarioEditar.portal?.id
      );
      this.selectedPortal = portalSelecionadoEditar?.nombre ?? '';
      this.formularioUsuario
        .get('portal.id')
        ?.setValue(portalSelecionadoEditar?.id);
    }
  }

  get nombre() {
    return this.formularioUsuario.get('nombre');
  }
  get rol() {
    return this.formularioUsuario.get('rol');
  }
  get email() {
    return this.formularioUsuario.get('correoElectronico');
  }

  get documento() {
    return this.formularioUsuario.get('documento');
  }

  get tipoDocumento() {
    return this.formularioUsuario.get('tipoDocumento');
  }

  get portal() {
    return this.formularioUsuario.get('portal');
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

  existeDocumentoValidator() {
    return (control: AbstractControl): Promise<ValidationErrors | null> => {
      const value = control.value;
      if (!value) {
        return Promise.resolve(null);
      }

      return this.usuariosService
        .existeUsuario({ documento: control.value, correoElectronico: '' })
        .then((data) => {
          if (data) {
            return { existeDocumento: true };
          } else {
            return null;
          }
        });
    };
  }

  rolValidator() {
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

  onChangePortal() {
    this.selectedPortalObject = this.opcionesPortales?.find(
      (portal) => portal.nombre == this.selectedPortal
    );
    this.formularioUsuario
      .get('portal.id')
      ?.setValue(this.selectedPortalObject?.id);

  }

  onChangeDocument() {
   
  }
}
