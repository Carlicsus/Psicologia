import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ErrorService } from '../core/services/error.service';

export const addTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const _errorService = inject(ErrorService);
  const token = localStorage.getItem('token');
  if(token){
    req = req.clone({setHeaders:{Authorization:`Bearer ${token}`}}) 
  }
  const ws = sessionStorage.getItem('wsClient');
  if(ws){
    req = req.clone({setHeaders:{WebSocketClientID:`${ws}`}}) 
  }
  return next(req).pipe(
    catchError((error:HttpErrorResponse)=>{
      if(error.status===401){
        _errorService.msjError(error);
        router.navigate(['/login']);
      }
      return throwError(()=> error)
    })
  );
};
