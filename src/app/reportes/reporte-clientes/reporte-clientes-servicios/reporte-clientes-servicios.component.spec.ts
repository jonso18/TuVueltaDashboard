import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteClientesServiciosComponent } from './reporte-clientes-servicios.component';

describe('ReporteClientesServiciosComponent', () => {
  let component: ReporteClientesServiciosComponent;
  let fixture: ComponentFixture<ReporteClientesServiciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteClientesServiciosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteClientesServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
