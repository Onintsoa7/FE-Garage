import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoitureService } from '../../core/services/frontoffice/voiture.service';
import { Voiture } from '../../core/models/voiture';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ConfirmationComponent } from '../../confirmation/confirmation.component';
import { ServiceService } from '../../core/services/frontoffice/service.service';
import { Facture } from '../../core/models/facture';

@Component({
  selector: 'app-profil-data',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    MatPaginatorModule,
    MatTableModule
  ],
  templateUrl: './profil-data.component.html',
  styleUrls: ['./profil-data.component.scss']
})
export class ProfilDataComponent implements OnInit {

  @Output() carFormClicked = new EventEmitter<void>();
  @Output() activeFactureClicked = new EventEmitter<string>();

  storedUser = sessionStorage.getItem('connected_user');
  id: string = this.storedUser ? JSON.parse(this.storedUser)._id : '';
  listeFacture = new MatTableDataSource<any>([]);
  voituresByUser = new MatTableDataSource<any>([]);
 
  @ViewChild('paginatorVoitures') paginatorVoitures!: MatPaginator;
  @ViewChild('paginatorVisites') paginatorVisites!: MatPaginator;

  displayedColumnsVoitures = ['marque', 'modele', 'annee', 'immatriculation', 'typeCarburant', 'puissance', 'kilometrage', 'action'];
  displayedColumnsVisites = ['car', 'date', 'service', 'details'];

  constructor(
    private voitureService: VoitureService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private service : ServiceService
  ) { }

  ngOnInit(): void {
    this.getVoituresListe();
    this.getFacturesListe();
  }

  ngAfterViewInit() {
    this.voituresByUser.paginator = this.paginatorVoitures;
    this.listeFacture.paginator = this.paginatorVisites;
  }

  getVoituresListe(): void {
    this.voitureService.getVoitureByUserId(this.id).subscribe((result: Voiture | Voiture[]) => {
      const voitures = Array.isArray(result) ? result : [result];
      this.voituresByUser.data = voitures;
    });
  }

  getFacturesListe(): void { 
    this.service.getFacturesByClientId(this.id).subscribe((result: Facture | Facture[]) => {
      const factures = Array.isArray(result) ? result : [result];
      this.listeFacture.data = factures;
    })
  }    

  onCarFormClick() {
    this.carFormClicked.emit();
  }

  onFactureClick(id: string): void {
    console.log('ID envoyé par EventEmitter :', id); // Ajouter ce log
    this.activeFactureClicked.emit(id); // Envoi de l'ID
}

  openDeleteConfirmationDialog(carId: string): void {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      data: { message: 'Voulez-vous vraiment supprimer cette voiture ?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.voitureService.deleteVoiture(carId).subscribe({
          next: () => {
            this.getVoituresListe();
            this.snackBar.open('Voiture supprimée avec succès !', 'Fermer', { duration: 3000, panelClass: ['success-snackbar'] });
          },
          error: (err) => {
            console.error('Erreur lors de la suppression de la voiture :', err);
            this.snackBar.open('Erreur lors de la suppression de la voiture.', 'Fermer', { duration: 3000, panelClass: ['error-snackbar'] });
          }
        });
      }
    });
  }
}
