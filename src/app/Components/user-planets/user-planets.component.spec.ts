import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPlanetsComponent } from './user-planets.component';

describe('UserPlanetsComponent', () => {
  let component: UserPlanetsComponent;
  let fixture: ComponentFixture<UserPlanetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserPlanetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPlanetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
