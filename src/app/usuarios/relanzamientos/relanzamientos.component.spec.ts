import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelanzamientosComponent } from './relanzamientos.component';

describe('RelanzamientosComponent', () => {
  let component: RelanzamientosComponent;
  let fixture: ComponentFixture<RelanzamientosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelanzamientosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelanzamientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
