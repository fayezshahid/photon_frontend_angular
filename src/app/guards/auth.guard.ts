import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isAuthenticated } from '../utils/auth.utils';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  if (isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};