import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTripsReservationComponent } from './user-trips-reservation.component';

describe('UserTripsReservationComponent', () => {
  let component: UserTripsReservationComponent;
  let fixture: ComponentFixture<UserTripsReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserTripsReservationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTripsReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
