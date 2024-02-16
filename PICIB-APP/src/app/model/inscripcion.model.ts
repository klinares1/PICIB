import { Capacitacion } from "./capacitacion.model";
import { Estudiante } from "./usuarios.model";

export interface Inscripcion{
  id?: string;
  estudiante?:Estudiante;
  capacitacion?:Capacitacion;
  estado?: boolean;
  certificacion?: {
    estado?: string;
    comentario?: string;
    fecha?: Date;
  };
  creadoEn?: Date;
  modificadoEn?: Date;
 }
