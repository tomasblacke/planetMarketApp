import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // <-- Importar FormsModule
import { HttpClientModule } from '@angular/common/http'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HeaderComponent } from './Components/header/header.component';
import { FooterComponent } from './Components/footer/footer.component';

import { HomeComponent } from './Components/home/home.component';
import { HeroComponent } from './Components/hero/hero.component';
import { PlanetCardsComponent } from './Components/planet-cards/planet-cards.component';
import { TripIntroComponent } from './Components/trip-intro/trip-intro.component';

import { FaqComponent } from './Components/faq/faq.component';
import { TiendaTripsComponent } from './Components/tienda-trips/tienda-trips.component';
import { TiendaPlanetsComponent } from './Components/tienda-planets/tienda-planets.component';

import { TiendaStarsComponent } from './Components/tienda-stars/tienda-stars.component';
import { PlanetComponent } from './Components/planet/planet.component';

import { NasaApiService } from './Services/nasa-api-service.service';
import { PlanetService } from './Services/planet.service';
import { LoginComponent } from './Components/login/login.component';



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
    PlanetComponent,
    LoginComponent // <-- Agregar LoginComponent aquí
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule // <-- Asegúrate de agregar FormsModule
  ],
  providers: [
    NasaApiService,
    PlanetService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
