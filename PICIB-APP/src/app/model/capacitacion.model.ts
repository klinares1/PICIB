import { Institucion } from "./Institucion.model";
import { Curso } from "./curso.model";
import { Portal } from "./portal.mode";

export interface Capacitacion {
  id?: string;
  curso?: Curso;
  horario?: {
    fechaInicio?: Date;
    fechaFin?: Date;
    portal?: Portal;
  };
  institucion?: Institucion;
  estado?: boolean;
}


