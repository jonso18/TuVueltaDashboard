import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogEquipamientoComponent } from './log-equipamiento.component';

describe('LogEquipamientoComponent', () => {
  let component: LogEquipamientoComponent;
  let fixture: ComponentFixture<LogEquipamientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogEquipamientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogEquipamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
