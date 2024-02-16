import { Component, Input, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';
import { Inscripcion } from 'src/app/model/inscripcion.model';

@Component({
  selector: 'app-bar-certificaciones',
  templateUrl: './bar-certificaciones.component.html',
  styleUrls: ['./bar-certificaciones.component.css'],
})
export class BarCertificacionesComponent {
  @Input() inscripcionesTodas: Inscripcion[];

  barChart: Chart<'bar'>;

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['inscripcionesTodas'] &&
      changes['inscripcionesTodas'].currentValue
    ) {
      if(this.barChart){
        this.barChart.destroy()
      }

      this.llenarDatosDona();
    }
  }

  llenarDatosDona() {

    const meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    const resultadoCertficados = this.inscripcionesTodas.reduce<{
      [key: string]: { NO: number; SI: number };
    }>((previus, inscripcion) => {
      const mes = meses[new Date(inscripcion.certificacion?.fecha!).getMonth()];
      const anio = new Date(inscripcion.certificacion?.fecha!).getFullYear();

      if (mes && anio) {
        const clave = mes + '-' + anio;
        if (!previus[clave]) {
          previus[clave] = { SI: 0, NO: 0 };
        }
        const estado = inscripcion.certificacion?.estado == 'SI' ? 'SI' : 'NO';
        previus[clave][estado] += 1;
      }
      return previus;
    }, {});

    this.barChart = new Chart('barChartCertificado', {
      type: 'bar',
      data: {
        labels: [...Object.keys(resultadoCertficados)],
        datasets: [
          {
            label: 'Certificados',
            data: Object.entries(resultadoCertficados).map(
              ([key, obj]) => obj.SI
            ),
            borderColor: '#2081C3',
            backgroundColor: '#2081C380',
          },
          {
            label: 'No certificados',
            data: Object.entries(resultadoCertficados).map(
              ([key, obj]) => obj.NO * -1
            ),
            borderColor: '#C42847',
            backgroundColor: '#C4284780',
          },
        ],
      },
      options: {
        indexAxis: 'y',

        elements: {
          bar: {
            borderWidth: 2,
          },
        },
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: 'Participantes Certificados',
          },
        },
      },
    });
  }
}
