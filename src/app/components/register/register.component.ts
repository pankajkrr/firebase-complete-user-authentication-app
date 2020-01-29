import { Component, OnInit, NgZone } from '@angular/core';

import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { FirebaseService, CommonService } from '../../services';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [FirebaseService, CommonService]
})
export class RegisterComponent implements OnInit {
  registerForm:FormGroup;
  readonly VERIFY_EMAIL = 'verify-email-address';
  constructor(
    private _firebase:FirebaseService, 
    private _common:CommonService
  ) { }

  ngOnInit() {
    this.registerForm = new FormGroup ({
      first_name: new FormControl (null, [Validators.required, Validators.maxLength(200)]),
      last_name: new FormControl (null, [Validators.required, Validators.maxLength(200)]),
      email: new FormControl (null, [Validators.required, Validators.email, Validators.maxLength(200)]),
      password: new FormControl (null, [Validators.required, Validators.maxLength (200)])
    })
  }

  submit(form):void {
    this._firebase.SignUp(form.value.email, form.value.password).then(res => {
      this._firebase.SendVerificationMail().then(resp => {
        this._common.navigate (this.VERIFY_EMAIL);
      })
    }).catch((err) => {
      console.log(err.message)
    })
  }

}
