import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudListComponent } from './solicitud-list.component';

describe('SolicitudListComponent', () => {
  let component: SolicitudListComponent;
  let fixture: ComponentFixture<SolicitudListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
