import { Component, OnInit, NgZone } from '@angular/core';
import { FirebaseService, CommonService } from '../../services';
//Toast
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [FirebaseService, CommonService]
})
export class HomeComponent implements OnInit {
  profileData:any;
  constructor(
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private _firebase:FirebaseService, 
    private _common:CommonService,
    private _toastr : ToastrService
  ) { }

  ngOnInit() {
    this.getProfileData();
  }

  // Method to get client list...
  getProfileData(){
    this._common.showLoader(true);
    this._firebase.getProfileData(sessionStorage.getItem('uid')).subscribe(res => {
      this.profileData = res.result;
    },error => {
      this._toastr.error("", `${error.message}`, {
        timeOut: 3000
      });      
    })
  }

}
