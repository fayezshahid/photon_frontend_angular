// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

let requestCount = 0;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const spinner = inject(NgxSpinnerService);
  const token = localStorage.getItem('token');

  // Show spinner for first request
  if (requestCount === 0) {
    spinner.show();
  }
  requestCount++;

  const clonedReq = token ? 
    req.clone({ 
      headers: req.headers.set('Authorization', 'Bearer ' + token) 
    }) : req;

  return next(clonedReq).pipe(
    finalize(() => {
      requestCount--;
      // Hide spinner when all requests complete
      if (requestCount === 0) {
        spinner.hide();
      }
    })
  );
};
