import { ENVIRONMENT_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; 
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


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
import { SpaceTripsDisplayComponent } from './Components/space-trips-display/space-trips-display.component';
import { TripReservaIdComponent } from './Components/trip-reserva-id/trip-reserva-id.component';
import { CommentsFormComponent } from './Components/comments-form/comments-form.component';
import { CommentListComponent} from './Components/comment-list/comment-list.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from './Environments/environments';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { UserProfileComponent } from './Components/user-profile/user-profile.component';
import { UserInfoComponent } from './Components/user-info/user-info.component';
import { UserPlanetsComponent } from './Components/user-planets/user-planets.component';
import { UserTripsReservationComponent } from './Components/user-trips-reservation/user-trips-reservation.component';
import { PlanetInitializerComponent } from './Components/planet-initializar/planet-initializar.component';





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
    SpaceTripsDisplayComponent,
    TripReservaIdComponent,
    CommentsFormComponent,
    CommentListComponent,
    LoginComponent,
    RegisterComponent,
    UserProfileComponent,
    UserInfoComponent,
    UserPlanetsComponent,
    UserTripsReservationComponent,
    PlanetInitializerComponent
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    ReactiveFormsModule,
  ],
  providers: [NasaApiService,PlanetService],
  bootstrap: [AppComponent]
})
export class AppModule { }
