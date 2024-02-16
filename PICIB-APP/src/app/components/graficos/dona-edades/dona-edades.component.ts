import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { Inscripcion } from 'src/app/model/inscripcion.model';

@Component({
  selector: 'app-dona-edades',
  templateUrl: './dona-edades.component.html',
  styleUrls: ['./dona-edades.component.css'],
})
export class DonaEdadesComponent implements OnChanges {
  @Input() inscripcionesTodas: Inscripcion[];

  doughnutChart: Chart<'doughnut'>;

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['inscripcionesTodas'] &&
      changes['inscripcionesTodas'].currentValue
    ) {
      if(this.doughnutChart){
        this.doughnutChart.destroy()
      }

      this.llenarDatosDona();

    }
  }

  llenarDatosDona() {
    const adolecente = this.inscripcionesTodas.filter((inscripcion) => {
      const anios =
        new Date(Date.now()).getFullYear() -
        new Date(inscripcion.estudiante?.fechaNacimiento!).getFullYear();
      return anios >= 12 && anios <= 18;
    }).length;

    const juventud = this.inscripcionesTodas.filter((inscripcion) => {
      const anios =
        new Date(Date.now()).getFullYear() -
        new Date(inscripcion.estudiante?.fechaNacimiento!).getFullYear();
      return anios >= 19 && anios <= 26;
    }).length;
    const adultez = this.inscripcionesTodas.filter((inscripcion) => {
      const anios =
        new Date(Date.now()).getFullYear() -
        new Date(inscripcion.estudiante?.fechaNacimiento!).getFullYear();
      return anios >= 27 && anios <= 59;
    }).length;
    const mayor = this.inscripcionesTodas.filter((inscripcion) => {
      const anios =
        new Date(Date.now()).getFullYear() -
        new Date(inscripcion.estudiante?.fechaNacimiento!).getFullYear();
      return anios >= 60;
    }).length;

    this.doughnutChart = new Chart('doughnutEdades', {
      type: 'doughnut',
      data: {
        labels: [
          'Adolescencia 12-18',
          'Juventud 19-26',
          'Adultez 27-59',
          'Persona Mayor - 60',
        ],
        datasets: [
          {
            label: 'Grafica de edades',
            data: [adolecente, juventud, adultez, mayor],
            backgroundColor: ['#166a8f', '#00a950', '#58595b', '#8549ba'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Certificados por edades',
          },
        },
      },
    });
  }
}
