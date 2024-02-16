export interface Institucion {
  id?: string ;
  nombre?: string;
  estado?: boolean;
  contacto?:{
    nombre?:string;
    numeroContacto?: string;
    correoElectronico?:string;
  }
}
