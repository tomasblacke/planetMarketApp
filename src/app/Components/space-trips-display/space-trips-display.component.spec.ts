import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceTripsDisplayComponent } from './space-trips-display.component';

describe('SpaceTripsDisplayComponent', () => {
  let component: SpaceTripsDisplayComponent;
  let fixture: ComponentFixture<SpaceTripsDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpaceTripsDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpaceTripsDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
