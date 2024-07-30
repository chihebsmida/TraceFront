import { TestBed } from '@angular/core/testing';

import { WorkSummaryService } from './work-summary.service';

describe('WorkSummaryService', () => {
  let service: WorkSummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkSummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
