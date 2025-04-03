import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../../constants';
import { Observable } from 'rxjs';
import { Piece } from '../../models/piece';
import { TypeService } from '../../models/type-service';
import { Service } from '../../models/service';
import { Voiture } from '../../models/voiture';
import { Facture } from '../../models/facture';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) {}

  getPieces(): Observable<Piece> {
    return this.http.get<Piece>(Constants.PIECE_API);
  }

  getPieceById(id: string): Observable<Piece> {
    return this.http.get<Piece>(`${Constants.PIECE_API}/${id}`);
  }

  addPiece(data: any): Observable<Piece> {
    return this.http.post<Piece>(Constants.PIECE_API, data);
  }

  updatePiece(id: string, data: any): Observable<Piece> {
    return this.http.put<Piece>(`${Constants.PIECE_API}/${id}`, data);
  }

  deletePiece(id: string): Observable<Piece> {
    return this.http.delete<Piece>(`${Constants.PIECE_API}/${id}`);
  }

  // -------- TYPE SERVICE ----------
  getTypeServices(): Observable<TypeService[]> {
    return this.http.get<TypeService[]>(Constants.TYPE_SERVICE_API);
  }

  getTypeServiceById(id: string): Observable<TypeService> {
    return this.http.get<TypeService>(`${Constants.TYPE_SERVICE_API}/${id}`);
  }

  getTypeServiceByNom(nom: string): Observable<TypeService> {
    return this.http.get<TypeService>(`${Constants.TYPE_SERVICE_API}/nom/${nom}`);
  }

  addTypeService(data: TypeService): Observable<TypeService> {
    return this.http.post<TypeService>(Constants.TYPE_SERVICE_API, data);
  }

  updateTypeService(id: string, data: TypeService): Observable<TypeService> {
    return this.http.put<TypeService>(`${Constants.TYPE_SERVICE_API}/${id}`, data);
  }

  deleteTypeService(id: string): Observable<TypeService> {
    return this.http.delete<TypeService>(`${Constants.TYPE_SERVICE_API}/${id}`);
  }

  // -------- SERVICE ----------
  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(Constants.SERVICE_API);
  }

  getServiceById(id: string): Observable<Service> {
    return this.http.get<Service>(`${Constants.SERVICE_API}/${id}`);
  }

  getServiceByIdUser(user: string): Observable<Service> {
    return this.http.get<Service>(`${Constants.SERVICE_API}/user/${user}`);
  }
  addService(data: Service): Observable<Service> {
    return this.http.post<Service>(Constants.SERVICE_API, data);
  }

  updateService(id: string, data: Service): Observable<Service> {
    return this.http.put<Service>(`${Constants.SERVICE_API}/${id}`, data);
  }

  deleteService(id: string): Observable<Service> {
    return this.http.delete<Service>(`${Constants.SERVICE_API}/${id}`);
  }

  // -------- VOITURE ----------
  getVoitures(idUser: string): Observable<Voiture[]> {
    return this.http.get<Voiture[]>(`${Constants.VOITURE_API}/${idUser}`);
  }

  getVoitureById(idUser: string): Observable<Voiture> {
    return this.http.get<Voiture>(`${Constants.VOITURE_API}/${idUser}`);
  }

  getVoitureByIdAndIdVoiture(idUser: string, id: string): Observable<Voiture> {
    return this.http.get<Voiture>(`${Constants.VOITURE_API}/${idUser}/${id}`);
  }

  addVoiture(data: Voiture): Observable<Voiture> {
    return this.http.post<Voiture>(Constants.VOITURE_API, data);
  }

  updateVoiture(id: string, data: Voiture): Observable<Voiture> {
    return this.http.put<Voiture>(`${Constants.VOITURE_API}/${id}`, data);
  }

  deleteVoiture(id: string): Observable<Voiture> {
    return this.http.delete<Voiture>(`${Constants.VOITURE_API}/${id}`);
  }
  // REHCERCHE
  searchServices(keyword: string): Observable<Service[]> {
    const url = `${Constants.SERVICE_API}/search-all?keyword=${encodeURIComponent(keyword)}`;
    return this.http.get<Service[]>(url);
  }
// RENDEZ-VOUS MECANICIEN
getServicesByEtatAndMecanicien(etat: string, mecanicienId: string): Observable<Service[]> {
  const url = `${Constants.SERVICE_API}/etat/${etat}/mecanicien/${mecanicienId}`;
  return this.http.get<Service[]>(url);
}

  //FACTURE
  getFactures(): Observable<Facture[]> {
    return this.http.get<Facture[]>(Constants.FACTURE_API);
  }

  getFactureById(id: string): Observable<Facture> {
    return this.http.get<Facture>(`${Constants.FACTURE_API}/${id}`);
  }

  addFacture(data: any): Observable<Facture> {
    return this.http.post<Facture>(Constants.FACTURE_API, data);
  }

  updateFacture(id: string, data: any): Observable<Facture> {
    return this.http.put<Facture>(`${Constants.FACTURE_API}/${id}`, data);
  }

  deleteFacture(id: string): Observable<any> {
    return this.http.delete(`${Constants.FACTURE_API}/${id}`);
  }

  getFacturesByClientId(idClient: string): Observable<Facture[]> {
    return this.http.get<Facture[]>(`${Constants.FACTURE_API}/client/${idClient}`); 
  }
}
