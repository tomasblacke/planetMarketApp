import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {
  readonly mail: string = 'soporte@planetMarket.com';
  faqs = [
    {
      question: '¿Es posible comprar terrenos en otros planetas?',
      answer: 'Sí, ofrecemos la opción de adquirir terrenos en varios planetas de nuestra galaxia. Sin embargo, estos terrenos no tienen reconocimiento oficial por parte de ningún gobierno terrestre. Son simbólicos, ideales para entusiastas del espacio o como regalos originales.'
    },
    {
      question: '¿Cómo puedo elegir el terreno que quiero comprar?',
      answer: 'Puedes seleccionar un terreno de entre los planetas disponibles en nuestro catálogo. Cada terreno tiene coordenadas específicas y puedes recibir un certificado personalizado con las características de tu parcela estelar.'
    },
    {
      question: '¿Qué incluye la compra de un terreno en otro planeta?',
      answer: 'La compra incluye un certificado digital que acredita la propiedad simbólica de un terreno en el planeta seleccionado. También recibirás un mapa interactivo que muestra la ubicación aproximada de tu terreno.'
    },
    {
      question: '¿Se puede visitar el terreno comprado en un futuro?',
      answer: 'Actualmente no existen medios comerciales para viajar a otros planetas muy lejanos, pero en el futuro cercano, con los avances en los viajes espaciales, puede ser posible. Por ahora, la compra representara tu terreno y podras verlo si se enuentra dentro de los viajes disponibles.'
    },
    {
    
      question: '¿Cómo funcionan los viajes estelares que ofrecen?',
      answer: 'Ofrecemos experiencias de un viaje interestelar y simulaciones. Puedes disfrutar de recorridos por planetas cercanos y estrellas desde la comodidad de nuestra nave o desde la comodidad de tu casa. Además, estamos colaborando con empresas de turismo espacial para ofrecer viajes a mayor distancia en un futuro.'

    },
    {
      question: '¿Cuáles son los destinos disponibles para los viajes estelares?',
      answer: 'Nuestros destinos incluyen planetas dentro de nuestro sistema solar, como Marte y la Luna, además de planetas más distantes como Proxima b. Para los viajes virtuales, también puedes explorar nebulosas y otros fenómenos cósmicos.'
    },
    {
      question: '¿Es seguro viajar al espacio?',
      answer: 'Si bien viajar al espacio tiene sus riesgos, nuestras naves estan preparadas para adptarse al entorno espacial.'
    },
    {
      question: ' ¿Puedo obtener un reembolso si cambio de opinión?',
      answer: 'Los reembolsos están sujetos a las políticas de nuestra empresa. Generalmente, para terrenos en otros planetas no se realizan reembolsos. En el caso de experiencias virtuales o viajes espaciales, ofrecemos una política de cancelación flexible.'
    },
    {
      question:'¿Qué debo hacer si tengo más preguntas?',
      answer: 'Si tienes más preguntas o inquietudes, puedes contactarnos a través de un correo electrionico '
    }
    // Agrega más preguntas aquí
  ];
}
