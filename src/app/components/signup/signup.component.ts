import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password_confirmation: ''
  };

  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.errorMessage = '';

    if (this.formData.password !== this.formData.password_confirmation) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    const payload = {
      firstName: this.formData.firstName,
      lastName: this.formData.lastName,
      email: this.formData.email,
      password: this.formData.password,
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.router.navigate(['/photos']);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Signup failed. Please try again.';
      }
    });
  }
}
