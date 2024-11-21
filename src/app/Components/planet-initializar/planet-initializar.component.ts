import { Component } from '@angular/core';
import { PlanetService } from '../../Services/planet.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-planet-initializar',
  templateUrl: './planet-initializar.component.html',
  styleUrl: './planet-initializar.component.css'
})
export class PlanetInitializerComponent {
  isSettingUp = false;
  isLoading = false;
  setupMessage = '';
  loadMessage = '';
  setupSuccess = false;
  loadSuccess = false;
  collectionsStatus: any = null;

  constructor(
    private firestore: AngularFirestore,
    private planetService: PlanetService
  ) {
    this.checkCollectionsStatus();
  }

  async checkCollectionsStatus() {
    try {
      const planetsSnapshot = await this.firestore.collection('planets').get().toPromise();
      const usersSnapshot = await this.firestore.collection('users').get().toPromise();
      const purchasesSnapshot = await this.firestore.collection('purchases').get().toPromise();

      this.collectionsStatus = {
        planets: !planetsSnapshot?.empty,
        users: !usersSnapshot?.empty,
        purchases: !purchasesSnapshot?.empty
      };
    } catch (error) {
      console.error('Error checking collections:', error);
    }
  }

  async setupCollections() {
    if (!confirm('Cargamos ?')) { // un extra de seguridad para resetear todo
      return;
    }

    this.isSettingUp = true;
    this.setupMessage = '';
    
    try {
      // Verificar/Crear colección de compras
      const purchasesRef = this.firestore.collection('purchases');
      const purchasesDoc = await purchasesRef.get().toPromise();
      
      if (!purchasesDoc?.empty) {
        this.setupMessage = 'Las colecciones ya están configuradas';
        this.setupSuccess = true;
      } else {
        // Crear documento inicial en purchases
        await purchasesRef.doc('init').set({
          createdAt: new Date(),
          isInitialDocument: true
        });
        
        //LOS INDICES SE CREAN EN FIREBase
        this.setupMessage = 'Colecciones configuradas exitosamente';
        this.setupSuccess = true;
      }
    } catch (error) {
      console.error('Error setting up collections:', error);
      this.setupMessage = 'Error configurando colecciones: ' + (error instanceof Error ? error.message : 'Error');
      this.setupSuccess = false;
    } finally {
      this.isSettingUp = false;
      this.checkCollectionsStatus();
    }
  }
//OJO CON ESTA FUNCION, TE CARGA LOS PLANETAS( TIENE PARTES COMENTADAS PARA QUE TIRE ERROR DIRECTAMENTE)
  async initializePlanets() {
    if (!confirm('¿Estás seguro? cARGARA LOS PLANETAS AL SISTEMA')) {
      return;
    }

    this.isLoading = true;
    this.loadMessage = '';

    try {
      await this.planetService.loadDefaultPlanets();
      this.loadMessage = 'Planetas cargados exitosamente';
      this.loadSuccess = true;
    } catch (error) {
      console.error('Error loading planets:', error);
      this.loadMessage = 'Error cargando planetas: ' + (error instanceof Error ? error.message : 'Error desconocido');
      this.loadSuccess = false;
    } finally {
      this.isLoading = false;
      this.checkCollectionsStatus();
    }
  }
}