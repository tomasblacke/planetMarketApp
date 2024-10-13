import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiendaStarsComponent } from './tienda-stars.component';

describe('TiendaStarsComponent', () => {
  let component: TiendaStarsComponent;
  let fixture: ComponentFixture<TiendaStarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TiendaStarsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TiendaStarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
