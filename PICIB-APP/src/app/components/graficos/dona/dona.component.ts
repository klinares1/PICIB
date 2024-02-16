import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  Chart,

} from 'chart.js/auto';

import { Inscripcion } from 'src/app/model/inscripcion.model';


@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styleUrls: ['./dona.component.css'],
})
export class DonaComponent implements  OnChanges {

  @Input()inscripcionesTodas: Inscripcion[];

  doughnutChart: Chart<'pie'>;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['inscripcionesTodas'] && changes['inscripcionesTodas'].currentValue) {
      if(this.doughnutChart){
        this.doughnutChart.destroy()
      }

      this.llenarDatosDona();
    }
  }


  llenarDatosDona() {
    const hombres = this.inscripcionesTodas.filter(
      (inscripcion) => inscripcion.estudiante?.genero == 'Masculino'
    ).length;
    const mujeres = this.inscripcionesTodas.filter(
      (inscripcion) => inscripcion.estudiante?.genero == 'Femenino'
    ).length;
    const otro = this.inscripcionesTodas.filter(
      (inscripcion) => inscripcion.estudiante?.genero == 'Otro'
    ).length;

    this.doughnutChart = new Chart('doughnutChart', {
      type: 'pie',
      data: {
        labels: ['Hombres', 'Mujeres', 'Otros'],
        datasets: [
          {
            label: 'Grafica de generos',
            data: [hombres, mujeres, otro],
            backgroundColor: ['#b91d47', '#00aba9', '#2b5797'],
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
            text: 'Certificados por genero',
          },
        },
      },
    });
  }
}
