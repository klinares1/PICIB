import { Component, Input, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';
import { Inscripcion } from 'src/app/model/inscripcion.model';

@Component({
  selector: 'app-line-inscripciones',
  templateUrl: './line-inscripciones.component.html',
  styleUrls: ['./line-inscripciones.component.css']
})
export class LineInscripcionesComponent {
  @Input() inscripcionesTodas: Inscripcion[];

  lineChart: Chart<'line'>;

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['inscripcionesTodas'] &&
      changes['inscripcionesTodas'].currentValue
    ) {
     if(this.lineChart){
      this.lineChart.destroy()
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
      [key: string]: number;
    }>((previus, inscripcion) => {
      let mes = meses[new Date(inscripcion.certificacion?.fecha!).getMonth()];
      let anio = new Date(inscripcion.certificacion?.fecha!).getFullYear();

      if (!(mes && anio)) {

        mes =  meses[new Date(Date.now()).getMonth()];
        anio = new Date(Date.now()).getFullYear();
      }

      const clave = mes + '-' + anio;

      if (!previus[clave]) {
        previus[clave] = 0;
      }
      previus[clave] +=1;
      return previus;
    }, {});



    this.lineChart = new Chart('lineChartInscripciones', {
      type: 'line',
      data: {
        labels: Object.entries(resultadoCertficados).map(key=> key[0]).reverse(),
        datasets: [
          {
            label: 'Inscritos',
            data: Object.entries(resultadoCertficados).map(key=> key[1]),
            borderColor: '#2081C3',
            backgroundColor: '#2081C380',
            fill: false,
          }
        ],
      },
      options: {

        interaction:{
          intersect: false,
        },

        responsive: true,
        plugins: {
          filler:{
            propagate: false,
          },

          title: {
            display: true,
            text: 'Total inscripciones',
          },

        },
      },
    });
  }
}
