import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoRetirementCreditDialogComponent } from './no-retirement-credit-dialog.component';

describe('NoRetirementCreditDialogComponent', () => {
  let component: NoRetirementCreditDialogComponent;
  let fixture: ComponentFixture<NoRetirementCreditDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoRetirementCreditDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoRetirementCreditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
