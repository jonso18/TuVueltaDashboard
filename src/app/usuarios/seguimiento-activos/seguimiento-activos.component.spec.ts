import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoActivosComponent } from './seguimiento-activos.component';

describe('SeguimientoActivosComponent', () => {
  let component: SeguimientoActivosComponent;
  let fixture: ComponentFixture<SeguimientoActivosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeguimientoActivosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguimientoActivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
