export interface Comment {
    id?: number;
    itemId: number;  // ID del planeta o viaje
    itemType: 'planet' | 'trip';  // Para distinguir si es un comentario de planeta o viaje
    userName: string;
    text: string;
    date: Date;
    rating?: number;
}
