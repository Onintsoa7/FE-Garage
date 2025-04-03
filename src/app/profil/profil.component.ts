import { Component } from '@angular/core';
import { HeaderPagesComponent } from '../header-pages/header-pages.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { NotesComponent } from '../notes/notes.component';
import { ProfilContainerComponent } from './profil-container/profil-container.component';
import { ProfilDataComponent } from './profil-data/profil-data.component';
import { ProfilEditComponent } from './profil-edit/profil-edit.component';
import { ProfilCarComponent } from "./profil-car/profil-car.component";
import { ProfilFactureComponent } from "./profil-facture/profil-facture.component";
@Component({
  selector: 'app-profil',
  imports: [CommonModule, HeaderPagesComponent, FooterComponent, NotesComponent, ProfilContainerComponent, ProfilDataComponent, ProfilEditComponent, ProfilCarComponent, ProfilFactureComponent],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss'
})
export class ProfilComponent {
  isEditing = false;
  IscarForm = false;
  IsFactureOpen = false;
  selectedFactureId: string | null = null; 
  onEditProfile() {
    this.IscarForm = false;
    this.isEditing = true;
    this.IsFactureOpen = false;
  }

  onCarForm() {
    this.isEditing = false;
    this.IscarForm = true;
    this.IsFactureOpen = false;
  }

  onFacture(id: string) {
    console.log("Facture sélectionnée avec ID :", id);
    this.IsFactureOpen = true;
    this.selectedFactureId = id;
    this.isEditing = false;
    this.IscarForm = false;
  }

  onCancleFacture() {
    this.IsFactureOpen = false;
  }
  onCancelCarForm() {
    this.IscarForm = false;
  }
  onCancelEdit(): void {
    this.isEditing = false;
  }
}
