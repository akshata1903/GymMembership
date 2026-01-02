import { TestBed } from '@angular/core/testing';

import { MembershipPlanService } from './membership-plan-service';

describe('MembershipPlanService', () => {
  let service: MembershipPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MembershipPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
