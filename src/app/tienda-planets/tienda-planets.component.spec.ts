import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiendaPlanetsComponent } from './tienda-planets.component';

describe('TiendaPlanetsComponent', () => {
  let component: TiendaPlanetsComponent;
  let fixture: ComponentFixture<TiendaPlanetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TiendaPlanetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiendaPlanetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
