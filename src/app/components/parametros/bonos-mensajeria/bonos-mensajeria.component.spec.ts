import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BonosMensajeriaComponent } from './bonos-mensajeria.component';

describe('BonosMensajeriaComponent', () => {
  let component: BonosMensajeriaComponent;
  let fixture: ComponentFixture<BonosMensajeriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BonosMensajeriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BonosMensajeriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
