import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadodecuentaComponent } from './estadodecuenta.component';

describe('EstadodecuentaComponent', () => {
  let component: EstadodecuentaComponent;
  let fixture: ComponentFixture<EstadodecuentaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadodecuentaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadodecuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
