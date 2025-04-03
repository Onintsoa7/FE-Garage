import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '../../constants';
import { Observable } from 'rxjs';
import { Piece } from '../../models/piece';
import { TypeService } from '../../models/type-service';
import { Service } from '../../models/service';
import { Voiture } from '../../models/voiture';

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

  updateService(id: string, data: Partial<Service>): Observable<Service> {
    const token = sessionStorage.getItem('bo_auth_token'); 
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<Service>(`${Constants.SERVICE_API}/${id}`, data, { headers });
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

  // Charge de travail par utilisateur par mois par date
  getChargeDeTravailParMecanoParDateParMois(mecanicien: string, year: number, month: number): Observable<any> {
    return this.http.get<any>(`${Constants.SERVICE_API}/mecanicien/${mecanicien}/duree-travail/${year}/${month}`);
  }

  // Récupérer tous les services dont la dateFixeVisite est aujourd'hui
  getServicesToday(): Observable<any> {
    return this.http.get<any[]>(`${Constants.SERVICE_API}/today`);
  }

  getCountByEtat(etat: string): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${Constants.SERVICE_API}/etat/${etat}`);
  }

  // Récupérer le montant total par mois pour une année donnée
  getMontantTotalByYear(year: number): Observable<any> {
    return this.http.get<any>(`${Constants.SERVICE_API}/montant-total/${year}`);
  }
  // Récupérer le montant total par mois pour une année donnée
  getCA(): Observable<any> {
    return this.http.get<any>(`${Constants.SERVICE_API}/montant-total/global`);
  }
  // RENDEZ-VOUS MECANICIEN
  getServicesByEtatAndMecanicien(etat: string, mecanicienId: string): Observable<Service[]> {
    const url = `${Constants.SERVICE_API}/etat/${etat}/mecanicien/${mecanicienId}`;
    return this.http.get<Service[]>(url);
  }


}
