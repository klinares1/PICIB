import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { InscripcionFormularioComponent } from './components/inscripcion-formulario/inscripcion-formulario.component';
import { CursosGestorComponent } from './components/cursos-gestor/cursos-gestor.component';
import { InstitucionesGestorComponent } from './components/instituciones-gestor/instituciones-gestor.component';
import { AuthGuard } from './guards/auth.guard';
import { PortalesGestorComponent } from './components/portales-gestor/portales-gestor.component';
import { CapacitacionesGestorComponent } from './components/capacitaciones-gestor/capacitaciones-gestor.component';

import { UsuariosGestorComponent } from './components/usuarios-gestor/usuarios-gestor.component';
import { CursosInformacionComponent } from './components/cursos-informacion/cursos-informacion.component';
import { InscripcionesGestorComponent } from './components/inscripciones-gestor/inscripciones-gestor.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { LoginblockGuard } from './guards/loginblock.guard';
import { EstaLogeadoGuard } from './guards/esta-logeado.guard';
import { HorariosComponent } from './components/horarios/horarios.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inscripcion',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginblockGuard]
  },
  {
    path: 'inscripcion',
    component: InscripcionFormularioComponent,
  },
  {
    path: 'cursos',
    component: CursosGestorComponent,
    canActivate: [AuthGuard],
    data:{
      rolesPermitidos: ['ADMIN'],
    },

  },
  {
    path: 'instituciones',
    component: InstitucionesGestorComponent,
    canActivate: [AuthGuard],
    data:{
      rolesPermitidos: ['ADMIN'],
    },
  },
  {
    path: 'portales',
    component: PortalesGestorComponent,
    canActivate: [AuthGuard],
    data:{
      rolesPermitidos: ['ADMIN'],
    },
  },
  {
    path: 'capacitaciones',
    component: CapacitacionesGestorComponent,
    canActivate: [AuthGuard],
    data:{
      rolesPermitidos: ['ADMIN'],
    },
  },
  {
    path: 'usuarios',
    component: UsuariosGestorComponent,
    canActivate: [AuthGuard],
    data:{
      rolesPermitidos: ['ADMIN'],
    },
  },
  {
    path: 'inscripciones',
    component: InscripcionesGestorComponent,
    canActivate: [AuthGuard],
    data:{
      rolesPermitidos: ['ADMIN','GUIATIC'],
    },
  },
  {
    path: 'reportes',
    component: ReportesComponent,
    canActivate: [AuthGuard],
    data:{
      rolesPermitidos: ['ADMIN'],
    },
  },
  {
    path: 'info-cursos',
    component: CursosInformacionComponent
  },
  {
    path: 'horarios',
    component: HorariosComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
