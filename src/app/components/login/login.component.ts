import { Component, OnInit, NgZone } from '@angular/core';

import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';

import { FirebaseService, CommonService } from '../../services';
//Toast
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [FirebaseService, CommonService]
})
export class LoginComponent implements OnInit {

  loginForm:FormGroup;
  readonly HOME = '';

  constructor(
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private _firebase:FirebaseService, 
    private _common:CommonService,
    private _toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup ({
      email: new FormControl (null, [Validators.required, Validators.email, Validators.maxLength(200)]),
      password: new FormControl (null, [Validators.required, Validators.maxLength (200)])
    })
  }

  submit(form):void {
    this._firebase.SignIn(form.value.email, form.value.password).then(res => {
      this.ngZone.run(() => {
        sessionStorage.setItem('uid',res.user.uid);
        sessionStorage.setItem ('user', JSON.stringify (res.user));
        this._common.navigate (this.HOME);
      });
      this._firebase.SetUserData(res.user);
    }).catch((err) => {
      console.log(err.message)
      return this._toastr.error("", `${err.message}`, {
        timeOut: 3000
      });
    })
  }
}
