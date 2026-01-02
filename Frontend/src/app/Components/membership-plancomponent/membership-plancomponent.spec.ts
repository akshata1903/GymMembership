import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembershipPlancomponent } from './membership-plancomponent';

describe('MembershipPlancomponent', () => {
  let component: MembershipPlancomponent;
  let fixture: ComponentFixture<MembershipPlancomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembershipPlancomponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembershipPlancomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
