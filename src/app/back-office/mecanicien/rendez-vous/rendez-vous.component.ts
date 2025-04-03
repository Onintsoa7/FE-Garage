import { CommonModule } from '@angular/common';
import { Component ,OnInit} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormsModule } from '@angular/forms';
import { ServiceService } from '../../../core/services/frontoffice/service.service';
import { Service } from '../../../core/models/service';
import { Piece } from '../../../core/models/piece';
import { ChangeDetectorRef } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-rendez-vous',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CdkDropList,
    CdkDrag,
    NzCardModule,
    NzDividerModule,
    NzSelectModule,
    NzInputModule,
    NzButtonModule,
    NzSpinModule
  ],
  templateUrl: './rendez-vous.component.html',
  styleUrls: ['./rendez-vous.component.scss'],
  providers: [NzMessageService]
})
export class RendezVousComponent implements OnInit{

  mecano: string = sessionStorage.getItem('connected_admin') || '';
  todo: Service[] = [];
  inProgress: Service[] = [];
  done: Service[] = [];
  pieces:Piece[] = [];
  isLoading: boolean = false;
  hasTaskInProgress: boolean = false;
  facturations: Service[] = [];
  datenow: Date = new Date();
  nouvellePiece: string = '';
  nouveauPrix: number = 0;
  constructor(private Service: ServiceService, private message: NzMessageService, private cdr: ChangeDetectorRef) {}


  ngOnInit(): void {
    this.loadAllLists();
  }

  loadAllLists(): void {
    this.getTodoList();
    this.getInProgressList();
    this.getDoneList();
    this.loadFacturations();
    this.loadPiece();
  }

  getTodoList(): void {
    let parsedUser = JSON.parse(this.mecano);
    this.Service.getServicesByEtatAndMecanicien('assigne', parsedUser._id).subscribe({
      next: (data) => this.todo = Array.isArray(data) ? data : [],
      error: () => this.message.error('Erreur lors du chargement des tâches à faire')
    });
  }

  getInProgressList(): void {
    let parsedUser = JSON.parse(this.mecano);
    this.Service.getServicesByEtatAndMecanicien('en cours', parsedUser._id).subscribe({
      next: (data) => {
        this.inProgress = Array.isArray(data) ? data : [];
        this.hasTaskInProgress = this.inProgress.length > 0;
      },
      error: () => this.message.error('Erreur lors du chargement des tâches en cours')
    });
  }

  getDoneList(): void {
    let parsedUser = JSON.parse(this.mecano);
    this.Service.getServicesByEtatAndMecanicien('facturer', parsedUser._id).subscribe({
      next: (data) => this.done = Array.isArray(data) ? data : [],
      error: () => this.message.error('Erreur lors du chargement des tâches terminées')
    });
  }
  loadFacturations(): void {
    let parsedUser = JSON.parse(this.mecano);
    this.Service.getServicesByEtatAndMecanicien('facturer', parsedUser._id).subscribe({
      next: (data) => {
        this.facturations = Array.isArray(data) ? data : [];

        this.facturations.forEach(facture => {
          facture.piece = facture.piece.map((p: any) => p.fille);

          if (!facture.prixPiece || !Array.isArray(facture.prixPiece)) {
            facture.prixPiece = facture.piece.map(() => 0); // Initialise chaque prix de pièce à 0
          } else {
            // Assure la synchronisation si des pièces sont ajoutées
            facture.piece.forEach((_: string, index: number) => {
              if ((facture.prixPiece ?? [])[index] === undefined) {
                if (!facture.prixPiece) {
                  facture.prixPiece = [];
                }
                facture.prixPiece[index] = 0;
              }
            });
          }
          if (facture.dureeEstimeeEnNombre === undefined) {
            facture.dureeEstimeeEnNombre = 0; // Ou une valeur par défaut que tu veux
          }
        });
      },
      error: () => this.message.error('Erreur lors du chargement des facturations')
    });
  }

  loadPiece():void{
    this.Service.getPieces().subscribe({
      next: (data) => this.pieces = Array.isArray(data) ? data : [],
      error: () => this.message.error('Erreur lors du chargement des facturations')
    });
  }


  onPieceChange(facture: any): void {
    if (!facture.prixPiece || !Array.isArray(facture.prixPiece)) {
      facture.prixPiece = [];
    }

    facture.piece.forEach((piece: string, index: number) => {
      if (facture.prixPiece[index] === undefined) {
        facture.prixPiece[index] = 0;  // Initialise chaque prix de pièce à 0 par défaut
      }
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    const movedTask = event.previousContainer.data[event.previousIndex];

    if (movedTask.etat === 'facturer') {
      this.message.warning('Vous ne pouvez pas déplacer une tâche déjà Terminée.');
      return;
    }

    if (event.container.id === 'inProgressList' && this.hasTaskInProgress) {
      this.message.error('Vous avez déjà une tâche en cours. Terminez-la avant d\'en commencer une nouvelle.');
      return;
    }

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      if (event.container.id === 'todoList') {
        movedTask.etat = 'assigne';
      } else if (event.container.id === 'inProgressList') {
        movedTask.etat = 'en cours';
        this.hasTaskInProgress = true;
      } else if (event.container.id === 'doneList') {
        movedTask.etat = 'facturer';
        this.hasTaskInProgress = false;
      }
      this.isLoading = true;
      this.Service.updateService(movedTask._id, { etat: movedTask.etat }).subscribe({
        next: () => {
          this.message.success('État mis à jour avec succès !');
          this.loadAllLists();
          this.isLoading = false;
        },
        error: () => {
          this.message.error('Erreur lors de la mise à jour de l\'état');
          this.isLoading = false;
        }
      });
    }
  }

  facturer(facture: any): void {
    if (!facture.prixPiece || !Array.isArray(facture.prixPiece)) {
        this.message.error('Veuillez entrer les prix pour chaque pièce.');
        return;
    }

    // const totalPrixPiece = facture.prixPiece.reduce((total: number, prix: number) => total + Number(prix || 0), 0);

    const data = {
        service: facture._id,
        client: facture.user._id,
        typeService: facture.typeService._id,
        voiture: `${facture.voiture.marque} ${facture.voiture.modele} ${facture.voiture.immatriculation}`,
        piece: facture.piece,
        coutPiece: facture.prixPiece,
        // coutPiece: totalPrixPiece,
        coutReparation: 0,
        montantPayer: 0
    };

    console.log('Données envoyées :', data);
    this.isLoading = true;

    // Enchaîner les requêtes avec switchMap()
    this.Service.updateService(facture._id, { etat: 'apayer' }).pipe(
        switchMap(() => {
            this.message.success('État mis à jour avec succès !');
            return this.Service.addFacture(data);  // Appeler addFacture après la réussite de updateService
        })
    ).subscribe({
        next: () => {
            this.message.success('Facturation réalisée avec succès !');
            this.loadAllLists();
            this.isLoading = false;
        },
        error: () => {
            this.message.error('Erreur lors de la facturation ou mise à jour de l\'état');
            this.isLoading = false;
        }
    });
}



ajouterPiece(facture: any): void {
  if (!this.nouvellePiece || this.nouveauPrix <= 0) {
    this.message.error('Veuillez entrer un nom de pièce valide et un prix positif.');
    return;
  }

  facture.piece.push(this.nouvellePiece);
  if (!facture.prixPiece || !Array.isArray(facture.prixPiece)) {
    facture.prixPiece = [];
  }
  facture.prixPiece.push(this.nouveauPrix);
  console.log('Pièces actuelles :', facture.piece);
  console.log('Prix actuels :', facture.prixPiece);
  this.nouvellePiece = '';
  this.nouveauPrix = 0;
  this.cdr.detectChanges();
}


updatePrixPiece(facture: any, index: number): void {
  console.log('Prix mis à jour pour la pièce index', index, ':', facture.prixPiece[index]);
}



}
