import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { FaqComponent } from './Components/faq/faq.component';
import { TiendaTripsComponent } from './Components/tienda-trips/tienda-trips.component';
import { TiendaPlanetsComponent} from './Components/tienda-planets/tienda-planets.component';
import { PlanetComponent } from './Components/planet/planet.component';
import { SpaceTripsDisplayComponent } from './Components/space-trips-display/space-trips-display.component';
import { TripReservaIdComponent } from './Components/trip-reserva-id/trip-reserva-id.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { UserProfileComponent } from './Components/user-profile/user-profile.component';
import { UserInfoComponent } from './Components/user-info/user-info.component';
import { UserPlanetsComponent } from './Components/user-planets/user-planets.component';
import { UserTripsReservationComponent } from './Components/user-trips-reservation/user-trips-reservation.component';
import { PlanetInitializerComponent } from './Components/planet-initializar/planet-initializar.component';
import { AdminManagementComponent } from './Components/admin-management/admin-management.component';
import { PurchasesComponent } from './Components/purchases/purchases.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'trips', component: SpaceTripsDisplayComponent },// antes esta tienda trips consumiendo apod api
  { path: 'trips/:id', component:TripReservaIdComponent},
  { path: 'planets', component: TiendaPlanetsComponent},
  { path: 'planets/:planetID', component: PlanetComponent},// este nos va a llevar a la data de cada planeta
  {path: 'login',component: LoginComponent},
  { path: 'admin-management', component: AdminManagementComponent },
  {path:'purchases', component: PurchasesComponent},
  {path:'register',component: RegisterComponent},
  {
    path: 'profile',
    component: UserProfileComponent,
    children: [
      { path: '', redirectTo: 'info', pathMatch: 'full' }, // Ruta por defecto

      { path: 'info', component: UserInfoComponent },      
      { path: 'planets', component: UserPlanetsComponent }, 
      { path: 'trips', component: UserTripsReservationComponent } 
    ]
    
  },
  /*
  {path: 'init', component:PlanetInitializerComponent},//esto ya se uso una vez para la carga de planetas en firebase
  */
  // Añadir otras rutas aca
  { path: '**', redirectTo: '' } // Ruta comodín, redirige a home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
