import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingRouteComponent } from './loading-route.component';

describe('LoadingRouteComponent', () => {
  let component: LoadingRouteComponent;
  let fixture: ComponentFixture<LoadingRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
