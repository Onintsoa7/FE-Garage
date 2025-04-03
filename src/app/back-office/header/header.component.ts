import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { SigninService } from '../../core/services/signin.service';
@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  hasConnectedUSer = false;
  constructor(private router: Router, private signin: SigninService) {}

  ngOnInit(): void {
    const storedUser = this.signin.getConnectedUser();
    if (storedUser) {
      this.hasConnectedUSer = true;
    }
  }
  deconnexion(){
    this.signin.deconnexion();
    this.hasConnectedUSer = false;
    this.router.navigate(['/backoffice']);
  }
}
