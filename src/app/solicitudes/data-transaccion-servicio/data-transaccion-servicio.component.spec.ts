import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTransaccionServicioComponent } from './data-transaccion-servicio.component';

describe('DataTransaccionServicioComponent', () => {
  let component: DataTransaccionServicioComponent;
  let fixture: ComponentFixture<DataTransaccionServicioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTransaccionServicioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTransaccionServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
