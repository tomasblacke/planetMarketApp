export interface Comment {
    id: string; // Cambiado a string
    itemId: number;
    itemType: 'planet' | 'trip';
    userName: string;
    text: string;
    date: Date;
    rating?: number;
  }
  