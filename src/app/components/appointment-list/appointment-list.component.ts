import { Component, OnInit } from '@angular/core';
import { FirebaseService, CommonService } from '../../services';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';

//Toast
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css'],
  providers: [FirebaseService, CommonService]
})
export class AppointmentListComponent implements OnInit {
  appointmentList =[];
  clientList :[];
  clientId:string;
  searchForm:FormGroup;
  constructor(
    private _firebase : FirebaseService,
    private _common : CommonService,
    private _toastr : ToastrService
  ) { }

  ngOnInit() {
    // this.getAppointmentList();
    this.getClientList();
    this.searchForm = new FormGroup ({
      clientId: new FormControl (null, [Validators.required, Validators.maxLength(200)])
    })
  }

   // Method to get appointment list...
   getAppointmentList(form){
    this._common.showLoader(true);
    this._firebase.GetAppointmentList(form.value.clientId).subscribe(res => {
      this.appointmentList = res.result;
      console.log(this.appointmentList,'appointment list---');
    },error => {
      this._toastr.error("", `${error.message}`, {
        timeOut: 3000
      });      
    })
  }


  // Method to get client list...
 getClientList(){
  this._common.showLoader(true);
  this._firebase.GetClientList().subscribe(res => {
    this._common.showLoader(false);
    this.clientList = res.result;
    console.log(this.clientList,'client list---');

  },error => {
    this._toastr.error("", `${error.message}`, {
      timeOut: 3000
    });      
  })
}
}
