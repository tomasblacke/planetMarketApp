import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripIntroComponent } from './trip-intro.component';

describe('TripIntroComponent', () => {
  let component: TripIntroComponent;
  let fixture: ComponentFixture<TripIntroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TripIntroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
