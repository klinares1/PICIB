export interface Usuario{
  id?: string;
  nombre?: string;
  tipoDocumento?: string;
  documento?: string;
  rol?: string
  correoElectronico?: string;
  estado?: boolean;
  portal?:{
    id: string;
  }
}

export interface Estudiante extends Omit<Usuario, 'rol'| 'portal'>{

  numeroContacto?: string;
  localidad?: string;
  barrio?: string;
  fechaNacimiento?: Date;
  gradoEscolaridad?: string;
  ciudadResidencia?: string;
  lugarExpedicion?: string;
  genero?: string;

}


