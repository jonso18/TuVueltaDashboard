import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdTerNoPerComponent } from './id-ter-no-per.component';

describe('IdTerNoPerComponent', () => {
  let component: IdTerNoPerComponent;
  let fixture: ComponentFixture<IdTerNoPerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdTerNoPerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdTerNoPerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
