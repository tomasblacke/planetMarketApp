import { TestBed } from '@angular/core/testing';

import { TravelNotificationService } from './travel-notification.service';

describe('TravelNotificationService', () => {
  let service: TravelNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TravelNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
