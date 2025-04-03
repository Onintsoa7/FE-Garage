import { Piece } from "./piece";
import { TypeService } from "./type-service";
import { User } from "./user";
import { Voiture } from "./voiture";

export interface Service {
  etat: string;
  _id?: string;
  user: any;
  typeService: any;
  voiture: Voiture;
  piece?: any;
  avecPiece?: boolean[];
  prixPiece?: number[];
  description?: string;
  visibleSymptom?: boolean;
  image?: string;
  typeEntretien?: string;
  pieceAreparer?: string;
  date?: Date;
  dateDerniereEntretien?: Date;
  dateSuggestionVisite?: Date;
  heureSuggestionVisite?: string;
  dateFixeVisite?: Date;
  heureFixeVisite?: string;
  montantFinal?: number;
  duree?: number;
  createdAt?: Date;
  updatedAt?: Date;
  mecanicien?: any | User;
  dureeEstimee?:string;
  dureeEstimeeEnNombre?:number;
}
