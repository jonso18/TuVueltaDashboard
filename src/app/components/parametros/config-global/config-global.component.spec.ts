import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigGlobalComponent } from './config-global.component';

describe('ConfigGlobalComponent', () => {
  let component: ConfigGlobalComponent;
  let fixture: ComponentFixture<ConfigGlobalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigGlobalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
