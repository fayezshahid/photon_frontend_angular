// navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { getUserFromToken } from '../../utils/auth.utils';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  userEmail: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadUserInfo();
  }

  loadUserInfo() {
    const user = getUserFromToken();
    if (user) {
      this.userEmail = user.id || '';
    }
  }

  logout() {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Navigate to login page
    this.router.navigate(['/login']);
  }

}