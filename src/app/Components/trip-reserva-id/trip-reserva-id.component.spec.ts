import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripReservaIdComponent } from './trip-reserva-id.component';

describe('TripReservaIdComponent', () => {
  let component: TripReservaIdComponent;
  let fixture: ComponentFixture<TripReservaIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TripReservaIdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripReservaIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
