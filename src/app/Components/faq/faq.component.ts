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
      question: 'Is it possible to buy land on other planets?',
      answer: 'Yes, we offer the option to acquire land on various planets in our galaxy. However, these lands do not have official recognition from any Earth government. They are symbolic, ideal for space enthusiasts or as original gifts.'
    },
    {
      question: 'How can I choose the land I want to buy?',
      answer: 'You can select land from among the available planets in our catalog. Each plot has specific coordinates, and you can receive a personalized certificate with the characteristics of your stellar plot.'
    },
    {
      question: 'What does the purchase of land on another planet include?',
      answer: 'The purchase includes a digital certificate that proves symbolic ownership of land on the selected planet. You will also receive an interactive map showing the approximate location of your land.'
    },
    {
      question: 'Will it be possible to visit the purchased land in the future?',
      answer: 'Currently, there are no commercial means to travel to very distant planets, but in the near future, with advances in space travel, it may be possible. For now, the purchase will represent your land and you can view it if it falls within the available travel options.'
    },
    {
      question: 'How do the stellar travels you offer work?',
      answer: 'We offer interstellar journey experiences and simulations. You can enjoy tours of nearby planets and stars from the comfort of our spacecraft or from the comfort of your home. Additionally, we are collaborating with space tourism companies to offer longer-distance travels in the future.'
    },
    {
      question: 'What are the available destinations for stellar travels?',
      answer: 'Our destinations include planets within our solar system, such as Mars and the Moon, as well as more distant planets like Proxima b. For virtual travels, you can also explore nebulae and other cosmic phenomena.'
    },
    {
      question: 'Is space travel safe?',
      answer: 'While space travel has its risks, our spacecraft are prepared to adapt to the space environment.'
    },
    {
      question: 'Can I get a refund if I change my mind?',
      answer: 'Refunds are subject to our company policies. Generally, for land on other planets, refunds are not provided. In the case of virtual experiences or space travels, we offer a flexible cancellation policy.'
    },
    {
      question: 'What should I do if I have more questions?',
      answer: 'If you have more questions or concerns, you can contact us through email at ' + this.mail
    }
    // Agrega más preguntas aquí
  ];
}
