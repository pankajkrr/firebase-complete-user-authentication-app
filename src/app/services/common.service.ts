import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from "ngx-toastr";
import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor (
    private _router:Router,
    private _toastr: ToastrService,
    private _spinner : Ng4LoadingSpinnerService
    ) { }

  navigate (path:string):Promise<any> {
    return this._router.navigate([path]);
  }

  showLoader(status:boolean){
    if(status==true){
      this._spinner.show();
    }
    else{
      this._spinner.hide();
    }
  }

  

  successAlert(message:string){
    return this._toastr.success("", `${message}`, {
      timeOut: 3000
    });
  }

  errorAlert(message:string){
    return this._toastr.error("", `${message}`, {
      timeOut: 3000
    });
  }
}
