import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadosDomiciliosComponent } from './estados-domicilios.component';

describe('EstadosDomiciliosComponent', () => {
  let component: EstadosDomiciliosComponent;
  let fixture: ComponentFixture<EstadosDomiciliosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstadosDomiciliosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadosDomiciliosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
