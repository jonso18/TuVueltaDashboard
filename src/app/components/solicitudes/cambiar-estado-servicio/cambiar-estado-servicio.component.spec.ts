import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarEstadoServicioComponent } from './cambiar-estado-servicio.component';

describe('CambiarEstadoServicioComponent', () => {
  let component: CambiarEstadoServicioComponent;
  let fixture: ComponentFixture<CambiarEstadoServicioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CambiarEstadoServicioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CambiarEstadoServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
