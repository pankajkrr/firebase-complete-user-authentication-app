import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { FirebaseService, CommonService } from '../../services';
//Toast
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  providers: [FirebaseService, CommonService]
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm : FormGroup;
  constructor(
    private _firebase:FirebaseService, 
    private _common:CommonService,
    private _toastr: ToastrService
  ) { }

  ngOnInit() {
    this.forgotPasswordForm = new FormGroup ({
      email: new FormControl (null, [Validators.required, Validators.email, Validators.maxLength(200)])
    })
  }

  submit(form):void {
    this._firebase.ForgotPassword(form.value.email).then(res => {
      this._toastr.success("", `Link sent to your registered email to reset your password.`, {
        timeOut: 3000
      });
      this.forgotPasswordForm.reset();
    }).catch((err) => {
      this._toastr.error("", `${err.message}`, {
        timeOut: 3000
      });
    })

  }

}