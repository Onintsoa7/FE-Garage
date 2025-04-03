import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { HttpClientModule } from '@angular/common/http';
import { SigninService } from '../core/services/signin.service';
import { UserLogin } from '../core/models/user';

@Component({
  selector: 'app-back-office',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    HttpClientModule
  ],
  templateUrl: './back-office.component.html',
  styleUrls: ['./back-office.component.scss']
})
export class BackOfficeComponent {
  loginForm!: FormGroup;
  isLoading = false;
  userType: 'admin' | 'mecano' = 'admin';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private signinService: SigninService
  ) {
    this.initForm();
  }
  initForm() {
    if (this.userType === 'admin') {
      this.loginForm = this.fb.group({
        adresseMail: ['administrateur@example.com', [Validators.required, Validators.email]],
        password: ['administrateur', [Validators.required, Validators.minLength(6)]]
      });
    } else if (this.userType === 'mecano') {
      this.loginForm = this.fb.group({
        adresseMail: ['jean@mecano.com', [Validators.required, Validators.email]],
        password: ['jeanmecano', [Validators.required, Validators.minLength(6)]]
      });
    }
  }

  setUserType(type: 'admin' | 'mecano'): void {
    this.userType = type;
    this.initForm();
  }

  submitForm(): void {
    if (this.loginForm.invalid) {
      Object.values(this.loginForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      return;
    }

    const userLogin: UserLogin = {
      adresseMail: this.loginForm.value.adresseMail,
      password: this.loginForm.value.password
    };

    this.isLoading = true;
    this.signinService.loginUser(userLogin).subscribe({
      next: (response) => {
        setTimeout(() => {
          this.isLoading = false;
          if (this.userType === 'admin') {
            console.log("admin");
            this.router.navigate(['backoffice/admin']); // Rediriger Admin
          } else {
            console.log("mecano");
            this.router.navigate(['backoffice/mecanicien']); // Rediriger Mecano
          }
        }, 2000);
      },
      error: (err) => {
        console.error('Échec de la connexion :', err);
        this.isLoading = false;
      }
    });
  }
}
