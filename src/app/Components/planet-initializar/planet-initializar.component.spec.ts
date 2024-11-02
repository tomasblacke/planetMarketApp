import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetInitializarComponent } from './planet-initializar.component';

describe('PlanetInitializarComponent', () => {
  let component: PlanetInitializarComponent;
  let fixture: ComponentFixture<PlanetInitializarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlanetInitializarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanetInitializarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
