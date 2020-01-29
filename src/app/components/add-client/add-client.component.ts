import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';

import { FirebaseService, CommonService } from '../../services';

//Toast
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css'],
  providers: [FirebaseService, CommonService]
})
export class AddClientComponent implements OnInit {
  addClientForm:FormGroup;
  readonly CLIENT = 'client-list';
  constructor(
    private _firebase : FirebaseService,
    private _common : CommonService,
    private _toastr : ToastrService
  ) { }

  ngOnInit() {
    this.addClientForm = new FormGroup ({
      firstName: new FormControl (null, [Validators.required, Validators.maxLength(200)]),
      lastName: new FormControl (null, [Validators.required, Validators.maxLength(200)]),
      email: new FormControl (null, [Validators.required, Validators.email, Validators.maxLength(200)])
    })
  }

  submit(form):void {
    this._common.showLoader(true);
    this._firebase.AddNewClient(form.value).subscribe(res => {
      this._common.navigate (this.CLIENT);
      this._common.showLoader(false);
    },error => {
      this._toastr.error("", `${error.message}`, {
        timeOut: 3000
      });      
    })
  }

}
