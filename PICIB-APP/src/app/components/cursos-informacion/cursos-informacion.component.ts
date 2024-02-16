import { Component } from '@angular/core';
import { Curso } from 'src/app/model/curso.model';
import { CursosService } from 'src/app/services/cursos.service';

@Component({
  selector: 'app-cursos-informacion',
  templateUrl: './cursos-informacion.component.html',
  styleUrls: ['./cursos-informacion.component.css']
})
export class CursosInformacionComponent {
  cursos: Curso[] = [];
  constructor(private cursoService: CursosService){
    cursoService.getCursos().subscribe(cursos=>{
      this.cursos  = cursos.filter(curso => curso.estado);
    })
  }
}
