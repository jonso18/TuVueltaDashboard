import { TestBed, inject } from '@angular/core/testing';

import { GlobalTasksService } from './global-tasks.service';

describe('GlobalTasksService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalTasksService]
    });
  });

  it('should be created', inject([GlobalTasksService], (service: GlobalTasksService) => {
    expect(service).toBeTruthy();
  }));
});
