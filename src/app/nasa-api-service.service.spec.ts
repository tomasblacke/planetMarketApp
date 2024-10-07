import { TestBed } from '@angular/core/testing';

import { NasaApiService } from './nasa-api-service.service';

describe('NasaApiService', () => {
  let service: NasaApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NasaApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
