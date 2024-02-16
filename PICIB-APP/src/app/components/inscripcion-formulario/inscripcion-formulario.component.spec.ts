import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscripcionFormularioComponent } from './inscripcion-formulario.component';

describe('InscripcionFormularioComponent', () => {
  let component: InscripcionFormularioComponent;
  let fixture: ComponentFixture<InscripcionFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InscripcionFormularioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InscripcionFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
