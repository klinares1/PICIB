import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { MenuSuperiorComponent } from './components/menu-superior/menu-superior.component';
import { InscripcionFormularioComponent } from './components/inscripcion-formulario/inscripcion-formulario.component';
import { CursosGestorComponent } from './components/cursos-gestor/cursos-gestor.component';
import { CursosFormularioComponent } from './components/cursos-formulario/cursos-formulario.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificacionesPushComponent } from './components/notificaciones-push/notificaciones-push.component';
import { InstitucionesGestorComponent } from './components/instituciones-gestor/instituciones-gestor.component';
import { InstitucionesFormularioComponent } from './components/instituciones-formulario/instituciones-formulario.component';
import { PortalesGestorComponent } from './components/portales-gestor/portales-gestor.component';
import { PortalesFormularioComponent } from './components/portales-formulario/portales-formulario.component';
import { CapacitacionesFomularioComponent } from './components/capacitaciones-fomulario/capacitaciones-fomulario.component';
import { CapacitacionesGestorComponent } from './components/capacitaciones-gestor/capacitaciones-gestor.component';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID } from '@angular/core';
import { UsuariosGestorComponent } from './components/usuarios-gestor/usuarios-gestor.component';
import { UsuariosFormularioComponent } from './components/usuarios-formulario/usuarios-formulario.component';
import { CursosInformacionComponent } from './components/cursos-informacion/cursos-informacion.component';
import { InscripcionesGestorComponent } from './components/inscripciones-gestor/inscripciones-gestor.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { HttpClientModule } from '@angular/common/http';
import { InscripcionesFormularioCetificacionComponent } from './components/inscripciones-formulario-cetificacion/inscripciones-formulario-cetificacion.component';
import { DonaComponent } from './components/graficos/dona/dona.component';
import { DonaEdadesComponent } from './components/graficos/dona-edades/dona-edades.component';
import { BarCertificacionesComponent } from './components/graficos/bar-certificaciones/bar-certificaciones.component';
import { LineInscripcionesComponent } from './components/graficos/line-inscripciones/line-inscripciones.component';
import { HorariosComponent } from './components/horarios/horarios.component';
registerLocaleData(localeEs);
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    MenuSuperiorComponent,
    InscripcionFormularioComponent,
    CursosGestorComponent,
    CursosFormularioComponent,
    NotificacionesPushComponent,
    InstitucionesGestorComponent,
    InstitucionesFormularioComponent,
    PortalesGestorComponent,
    PortalesFormularioComponent,
    CapacitacionesFomularioComponent,
    CapacitacionesGestorComponent,
    UsuariosGestorComponent,
    UsuariosFormularioComponent,
    CursosInformacionComponent,
    InscripcionesGestorComponent,
    ReportesComponent,
    InscripcionesFormularioCetificacionComponent,
    DonaComponent,
    DonaEdadesComponent,
    BarCertificacionesComponent,
    LineInscripcionesComponent,
    HorariosComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
