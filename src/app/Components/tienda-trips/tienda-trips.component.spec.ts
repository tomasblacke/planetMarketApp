import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiendaTripsComponent } from './tienda-trips.component';

describe('TiendaTripsComponent', () => {
  let component: TiendaTripsComponent;
  let fixture: ComponentFixture<TiendaTripsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TiendaTripsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiendaTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
