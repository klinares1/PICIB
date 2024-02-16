import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursosGestorComponent } from './cursos-gestor.component';

describe('CursosGestorComponent', () => {
  let component: CursosGestorComponent;
  let fixture: ComponentFixture<CursosGestorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursosGestorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursosGestorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
