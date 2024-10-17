import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { FaqComponent } from './Components/faq/faq.component';
import { TiendaTripsComponent } from './Components/tienda-trips/tienda-trips.component';
import { TiendaPlanetsComponent } from './Components/tienda-planets/tienda-planets.component';
import { PlanetComponent } from './Components/planet/planet.component';
import { RegisterComponent } from './Components/register/register.component'; // Importa el nuevo componente de registro

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'trips', component: TiendaTripsComponent },
  { path: 'planets', component: TiendaPlanetsComponent },
  { path: 'planets/:planetID', component: PlanetComponent }, // Este nos lleva a la data de cada planeta
  { path: 'register', component: RegisterComponent }, // Nueva ruta para el registro jeje

  // Añadir otras rutas aca
  { path: '**', redirectTo: '' } // Ruta comodín, redirige a home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



