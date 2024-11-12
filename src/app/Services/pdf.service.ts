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

  async generateReservationPDF(reservation: any): Promise<void> {
    try {
      const doc = new jsPDF('p', 'mm', [297, 210]); // A4 vertical

      // Título
      doc.setFontSize(24);
      doc.setTextColor(0, 102, 204);
      doc.text('Travel Reservation Details', 105, 20, { align: 'center' });

      // Línea decorativa
      doc.setLineWidth(0.5);
      doc.setDrawColor(0, 102, 204);
      doc.line(20, 25, 190, 25);

      // Información del viaje
      doc.setFontSize(16);
      doc.setTextColor(0);
      doc.text('Trip Information:', 20, 40);

      // Detalles principales
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const tripDetails = [
        `Trip: ${reservation.tripTitle}`,
        `Description: ${reservation.tripDescription}`,
        `Origin: ${reservation.origin || 'Not specified'}`,
        `Destination: ${reservation.destination || 'Not specified'}`,
        `Total Seats: ${reservation.totalSeats}`,
        `Total Investment: $${reservation.totalInvested?.toLocaleString()}`
      ];

      doc.text(tripDetails, 20, 50);

      // Información de pasajeros
      doc.setFontSize(16);
      doc.text('Passenger Details:', 20, 100);

      // Lista de pasajeros
      if (reservation.passengers && reservation.passengers.length > 0) {
        let yPosition = 110;
        
        // Encabezados
        doc.setFont('helvetica', 'bold');
        doc.text('Name', 20, yPosition);
        doc.text('ID', 80, yPosition);
        doc.text('Mail', 140, yPosition);
        
        // Línea bajo los encabezados
        yPosition += 2;
        doc.line(20, yPosition, 190, yPosition);
        
        // Datos de pasajeros
        doc.setFont('helvetica', 'normal');
        reservation.passengers.forEach((passenger: any) => {
          yPosition += 10;
          doc.text(passenger.name || '', 20, yPosition);
          doc.text(passenger.id || '', 80, yPosition);
          doc.text(passenger.mail || '', 140, yPosition);
        });

        // Información adicional
        yPosition += 20;
        doc.setFontSize(12);
        doc.text('Additional Information:', 20, yPosition);

        const additionalInfo = [
          `Reservation Date: ${new Date().toLocaleDateString()}`,
          `Reservation ID: ${reservation.id || 'Not specified'}`,
          `Payment Status: ${reservation.paymentStatus || 'Completed'}`
        ];

        yPosition += 10;
        doc.text(additionalInfo, 20, yPosition);

        // Términos y condiciones
        yPosition += 30;
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(
          'This document serves as official confirmation of your travel reservation. ' +
          'Please keep this document for your records. All reservations are subject to our terms and conditions.',
          20, 
          yPosition,
          { maxWidth: 170 }
        );

        // Pie de página
        doc.setFontSize(8);
        doc.text(
          'Generated by Travel Reservation System ©2024 - All rights reserved',
          105,
          285,
          { align: 'center' }
        );

        // QR Code simulado
        doc.setDrawColor(0);
        doc.rect(20, 260, 20, 20);
      }

      // Guardar el PDF
      const fileName = `Reservation-${reservation.tripTitle}-${new Date().getTime()}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }

}
