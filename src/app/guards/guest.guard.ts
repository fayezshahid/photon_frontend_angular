import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isAuthenticated } from '../utils/auth.utils';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  if (isAuthenticated()) {
    // User is already authenticated, redirect to main app
    router.navigate(['/photos']);
    return false;
  } else {
    // User is not authenticated, allow access to login/signup
    return true;
  }
};