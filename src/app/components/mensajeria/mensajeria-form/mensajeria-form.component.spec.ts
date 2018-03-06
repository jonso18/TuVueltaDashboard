import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeriaFormComponent } from './mensajeria-form.component';

describe('MensajeriaFormComponent', () => {
  let component: MensajeriaFormComponent;
  let fixture: ComponentFixture<MensajeriaFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MensajeriaFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MensajeriaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
