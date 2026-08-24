import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }
  async generatePlanetTittleCertificatePDF(planetData: any, userData: { name: string, lastname: string }) {
    const doc = new jsPDF('l', 'mm', [297, 210]); // A4 horizontal

    // Título
    doc.setFontSize(24);
    doc.setTextColor(217, 80, 50); // Color naranja (#D95032) RGB
    doc.text('Planetary Property Certificate', 149, 30, { align: 'center' });

    // Línea 
    doc.setLineWidth(0.5);
    doc.setDrawColor(217, 80, 50);
    doc.line(30, 40, 267, 40);

    // Contenido principal
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('This document certifies that:', 149, 60, { align: 'center' });

    // Nombre del propietario
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(`${userData.name} ${userData.lastname}`, 149, 75, { align: 'center' });

    // Detalles de la propiedad
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('is the owner of:', 149, 90, { align: 'center' });

    doc.setFontSize(18);
    doc.text(`${planetData.totalKilometers.toLocaleString()} square kilometers`, 149, 105, { align: 'center' });
    
    doc.setFontSize(16);
    doc.text(`of planet ${planetData.planetName}`, 149, 120, { align: 'center' });

    // Detalles adicionales
    doc.setFontSize(12);
    doc.text([
      `Type of Planet: ${planetData.planetType}`,
      `Issue date: ${new Date().toLocaleDateString()}`,
      `Planet ID: ${planetData.planetId}`
    ], 30, 150);

    // Nota legal
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      'This certificate is an official document proving ownership of the specified planetary surface.',
      149, 180,
      { align: 'center', maxWidth: 200 }
    );

    // Pie de página
    doc.setFontSize(8);
    doc.text('Planet Market ©2024 - All rights reserved', 149, 200, { align: 'center' });

    // Guardar el PDF
    doc.save(`Certificate-${planetData.planetName}-${userData.name}${userData.lastname}.pdf`);
  }

  //PASAJE DE UN VIAJE ESPACIAL
  async generateTripTicketPDF(tripData: any, userData: { name: string, lastname: string }) {
    const doc = new jsPDF('p', 'mm', 'a4'); // A4 vertical

    // Titulo
    doc.setFontSize(24);
    doc.setTextColor(217, 80, 50); // Mismo naranja que el certificado
    doc.text('Space Boarding Pass', 105, 30, { align: 'center' });

    // Linea
    doc.setLineWidth(0.5);
    doc.setDrawColor(217, 80, 50);
    doc.line(20, 40, 190, 40);

    // Nombre del viaje
    doc.setFontSize(18);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text(tripData.tripTitle, 105, 55, { align: 'center' });

    // Datos de la reserva
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text([
      `Titular: ${userData.name} ${userData.lastname}`,
      `Fecha de salida: ${this.formatDeparture(tripData.tripDeparture)}`,
      `Asientos: ${tripData.totalSeats}`,
      `Total abonado: $${(tripData.totalInvested || 0).toLocaleString()}`,
      `Codigo de reserva: ${tripData.tripId}`
    ], 20, 75);

    // Lista de pasajeros
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Pasajeros', 20, 115);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    if (tripData.passengers && tripData.passengers.length > 0) {
      const lista = tripData.passengers.map((pasajero: any, i: number) => `${i + 1}. ${pasajero.name} - ${pasajero.email}`);
      doc.text(lista, 20, 125);
    } else {
      doc.text('Esta reserva no tiene datos de pasajeros registrados.', 20, 125);
    }

    // Nota legal
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      'Presente este pasaje en la plataforma de embarque el dia de la salida.',
      105, 250,
      { align: 'center', maxWidth: 170 }
    );

    // Pie de pagina
    doc.setFontSize(8);
    doc.text('Planet Market ©2024 - All rights reserved', 105, 285, { align: 'center' });

    // Guardar el PDF
    doc.save(`Pasaje-${tripData.tripTitle}-${userData.name}${userData.lastname}.pdf`);
  }

  // La fecha de salida viene como Timestamp de Firebase
  private formatDeparture(date: any): string {
    if (!date) {
      return 'Not specified';
    }
    const validDate = date.seconds ? new Date(date.seconds * 1000) : new Date(date);
    if (isNaN(validDate.getTime())) {
      return 'Not specified';
    }
    return validDate.toLocaleDateString('en-GB');
  }
}
