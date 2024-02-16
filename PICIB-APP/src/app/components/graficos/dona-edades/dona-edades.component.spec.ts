import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonaEdadesComponent } from './dona-edades.component';

describe('DonaEdadesComponent', () => {
  let component: DonaEdadesComponent;
  let fixture: ComponentFixture<DonaEdadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonaEdadesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonaEdadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
