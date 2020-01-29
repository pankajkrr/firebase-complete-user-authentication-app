import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';

import { FirebaseService, CommonService } from '../../services';

//Toast
import { ToastrService } from "ngx-toastr";



@Component({
  selector: 'app-schedule-appointment',
  templateUrl: './schedule-appointment.component.html',
  styleUrls: ['./schedule-appointment.component.css']
})
export class ScheduleAppointmentComponent implements OnInit {

  clientList=[];
  appointmentForm:FormGroup;
  readonly APPOINTMENT= 'appointment-list';
  constructor(
    private _firebase : FirebaseService,
    private _common : CommonService,
    private _toastr : ToastrService
  ) { }

  ngOnInit() {
    this.appointmentForm = new FormGroup ({
      title: new FormControl (null, [Validators.required, Validators.maxLength(200)]),
      description: new FormControl (null, [Validators.required, Validators.maxLength(200)]),
      clientId: new FormControl (null, [Validators.required, Validators.maxLength(10)]),
      dateTime: new FormControl (null, [Validators.required])
    })
    this.getClientList();
  }

 // Method to get client list...
 getClientList(){
  this._common.showLoader(true);
  this._firebase.GetClientList().subscribe(res => {
    this._common.showLoader(false);
    this.clientList = res.result;
  },error => {
    this._toastr.error("", `${error.message}`, {
      timeOut: 3000
    });      
  })
}

// Method to schedule appointment
submit(form):void{
  // console.log(form.value); return;
  this._common.showLoader(true);
  this._firebase.ScheduleAppointment(form.value).subscribe(res => {
    this._common.navigate (this.APPOINTMENT);
    this._common.showLoader(false);
  },error => {
    this._toastr.error("", `${error.message}`, {
      timeOut: 3000
    });      
  })
}

}
