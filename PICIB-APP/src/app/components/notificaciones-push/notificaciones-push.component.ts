import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Notificacion } from 'src/app/model/notificaciones.model';

@Component({
  selector: 'app-notificaciones-push',
  templateUrl: './notificaciones-push.component.html',
  styleUrls: ['./notificaciones-push.component.css'],
})
export class NotificacionesPushComponent implements OnChanges {
  @Input()
  mensajeNotificacion: string = 'TEST DE NOTIFICACION';

  @Input()
  typeNotificacion: Notificacion = Notificacion.SUCCESS;

  @Input()
  tiempo: number = 3000;

  @Input()
  showNotificacion = false;

  ngOnInit() {}

  isSuccess() {
    return this.typeNotificacion === Notificacion.SUCCESS;
  }

  isWarning() {
    return this.typeNotificacion === Notificacion.WARNING;
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (
      changes['showNotificacion'] &&
      changes['showNotificacion'].currentValue
    ) {
      setTimeout(() => {

        this.showNotificacion = false;
      }, 3000);
    }
  }
}
