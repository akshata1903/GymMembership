import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sessioncomponent } from './sessioncomponent';

describe('Sessioncomponent', () => {
  let component: Sessioncomponent;
  let fixture: ComponentFixture<Sessioncomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sessioncomponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sessioncomponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
