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
}
