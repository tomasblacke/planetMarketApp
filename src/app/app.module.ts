import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; 


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import { HomeComponent } from './home/home.component';
import { HeroComponent } from './hero/hero.component';
import { PlanetCardsComponent } from './planet-cards/planet-cards.component';
import { TripIntroComponent } from './trip-intro/trip-intro.component';

import { FaqComponent } from './faq/faq.component';
import { TiendaTripsComponent } from './tienda-trips/tienda-trips.component';
import { TiendaPlanetsComponent } from './tienda-planets/tienda-planets.component';

import { TiendaStarsComponent } from './tienda-stars/tienda-stars.component';
import { PlanetComponent } from './planet/planet.component';

import { NasaApiService } from './nasa-api-service.service';
import { PlanetService } from './planet.service';

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
    TiendaStarsComponent,
    PlanetComponent
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [NasaApiService,PlanetService],
  bootstrap: [AppComponent]
})
export class AppModule { }
