import { Piece } from "./piece";
import { TypeService } from "./type-service";
import { Voiture } from "./voiture";

export interface Service {
  etat: string;
  _id?: string;
  user: string; // ID utilisateur
  typeService: string | TypeService;
  voiture: string | Voiture;
  piece?: string[] | Piece[];
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
  prixHeure?: number;
}
