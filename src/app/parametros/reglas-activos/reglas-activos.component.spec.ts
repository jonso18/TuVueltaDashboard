import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReglasActivosComponent } from './reglas-activos.component';

describe('ReglasActivosComponent', () => {
  let component: ReglasActivosComponent;
  let fixture: ComponentFixture<ReglasActivosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReglasActivosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReglasActivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
