import { TestBed } from '@angular/core/testing';

import { ExportDashServiceService } from './export-dash-service.service';

describe('ExportDashServiceService', () => {
  let service: ExportDashServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportDashServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
