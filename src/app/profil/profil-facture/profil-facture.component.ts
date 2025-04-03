import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Facture } from '../../core/models/facture';
import { ServiceService } from '../../core/services/frontoffice/service.service';

@Component({
  selector: 'app-profil-facture',
  imports: [CommonModule],
  templateUrl: './profil-facture.component.html',
  styleUrl: './profil-facture.component.scss'
})
export class ProfilFactureComponent implements OnInit {
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  @Input() factureId: string | undefined;
  FactureFacture: Facture | null = null;
  sousTotalHT: number = 0;
  montantTVA: number = 0;
  montantTotal: number = 0;
  
  constructor(private service : ServiceService) { }
  ngOnInit(): void {
    if (this.factureId) {
      this.loadFactureDetails();
    }
    
  }
  loadFactureDetails() {
    console.log(`Chargement des détails de la facture avec l'ID : ${this.factureId}`);
    if (this.factureId) {
      this.service.getFactureById(this.factureId).subscribe(facture => {
        this.FactureFacture = facture;
      });
    }
    this.calculerMontants();
  }
  
  factureNumero = this.FactureFacture?.numeroFacture;

  calculerMontants(): void {
    if (this.FactureFacture?.coutPiece) {
      // Calcul du sous-total HT
      this.sousTotalHT = this.FactureFacture.coutPiece.reduce((total: number, prix: number) => total + prix, 0);

      // Calcul de la TVA (20% de sousTotalHT)
      this.montantTVA = this.sousTotalHT * 0.2;

      // Calcul du montant total TTC (HT + TVA)
      this.montantTotal = this.sousTotalHT + this.montantTVA;
    }
  }

  downloadPDF(): void {
    if (!this.pdfContent) {
      console.error('pdfContent est introuvable');
      return;
    }
  
    const data = this.pdfContent.nativeElement;
    const marginTop = 10; // ✅ marge haute en mm
  
    html2canvas(data, { scale: 3 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
  
      const pageWidth = pdf.internal.pageSize.getWidth();   // 297mm
      const pageHeight = pdf.internal.pageSize.getHeight(); // 210mm
  
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pageWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
  
      // ✅ On décale vers le bas, et on garde tout visible
      pdf.addImage(imgData, 'PNG', 0, marginTop, imgWidth, imgHeight);
      pdf.save(`facture-${this.factureNumero}.pdf`);
    });
  }
  
}
