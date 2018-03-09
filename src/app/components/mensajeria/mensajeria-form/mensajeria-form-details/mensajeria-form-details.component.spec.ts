import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeriaFormDetailsComponent } from './mensajeria-form-details.component';

describe('MensajeriaFormDetailsComponent', () => {
  let component: MensajeriaFormDetailsComponent;
  let fixture: ComponentFixture<MensajeriaFormDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MensajeriaFormDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MensajeriaFormDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
