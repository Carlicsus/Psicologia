import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private toastr = inject(ToastrService);

  public msjError(e:HttpErrorResponse){
    if(e.status === 400){
      for(const error of e.error.errors){
        this.toastr.error(error.msg,"Error", {
          toastClass: 'ngx-toastr my-toast',
          positionClass: 'toast-bottom-right'
        });
      }
    }
    if(e.status === 401){
      this.toastr.error(e.error.msg,"Error", {
        toastClass: 'ngx-toastr my-toast',
        positionClass: 'toast-bottom-right'
      });
    }
    if(e.status === 409){
      this.toastr.error(e.error.msg,"Error", {
        toastClass: 'ngx-toastr my-toast',
        positionClass: 'toast-bottom-right'
      });
    }
    if(e.status === 500){
      this.toastr.error(e.error.msg,"Error", {
        toastClass: 'ngx-toastr my-toast',
        positionClass: 'toast-bottom-right'
      });
    }
    if(e.status === 404){
      this.toastr.error(e.error.msg,"Error", {
        toastClass: 'ngx-toastr my-toast',
        positionClass: 'toast-bottom-right'
      });
    }
  }
}
