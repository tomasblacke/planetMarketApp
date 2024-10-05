import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HeroComponent } from './hero/hero.component';
import { PlanetCardsComponent } from './planet-cards/planet-cards.component';
import { FooterComponent } from './footer/footer.component';
import { TripIntroComponent } from './trip-intro/trip-intro.component';
import { HomeComponent } from './home/home.component';
import { FaqComponent } from './faq/faq.component';
import { TiendaTripsComponent } from './tienda-trips/tienda-trips.component';
import { TiendaPlanetsComponent } from './tienda-planets/tienda-planets.component';
import { TiendaStarsComponent } from './tienda-stars/tienda-stars.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HeroComponent,
    PlanetCardsComponent,
    FooterComponent,
    TripIntroComponent,
    HomeComponent,
    FaqComponent,
    TiendaTripsComponent,
    TiendaPlanetsComponent,
    TiendaStarsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
