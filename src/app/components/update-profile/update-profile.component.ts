import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import * as firebase from 'firebase/app';
import { FirebaseService, CommonService } from '../../services';

import  { environment } from '../../../environments/environment';
//Toast
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css'],
  providers: [FirebaseService, CommonService]
})
export class UpdateProfileComponent implements OnInit {
  updateProfileForm : FormGroup;
  readonly HOME = '';
  selectedFile: File;
  profileData:any;
  constructor(
    private _firebase : FirebaseService,
    private _common : CommonService,
    private _toastr : ToastrService
  ) { }

  ngOnInit() {
    this.getProfileData();
    this.updateProfileForm = new FormGroup ({
      firstName: new FormControl (null, [Validators.required, Validators.maxLength(200)]),
      lastName: new FormControl (null, [Validators.required, Validators.maxLength(200)]),
      image: new FormControl (null, [Validators.maxLength(200)])
    })

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

  onFileChange(event) {
    this.selectedFile = event.target.files[0];
  }

  
  uploadFile(fileKey){
    return new Promise(function(resolve, reject) {
      var fire = firebase.initializeApp(environment.firebaseConfig);
      const uid = sessionStorage.getItem('uid');
      var storageRef = fire.storage().ref(`${uid}/${fileKey.name}`);
      var task = storageRef.put(fileKey);
      
      task.on('state_changed', function complete() {
        task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          // return downloadURL;
          resolve(downloadURL);
        });
      });
    });

  }

  submit(form):void {
    this._common.showLoader(true);
    if(this.selectedFile){
      this.uploadFile(this.selectedFile).then(res=>{
        form.value.imageUrl = res;
        form.value.uid = sessionStorage.getItem('uid');
        this._firebase.UpdateProfile(form.value).subscribe(res => {
          this._common.showLoader(false);
          this._toastr.success("", `Profile updated successfully!!`, {
            timeOut: 3000
          });  
          this._common.navigate (this.HOME);
        },error => {
          this._toastr.error("", `${error.message}`, {
            timeOut: 3000
          });      
        })
      });
    }
    else{
      this._firebase.UpdateProfile(form.value).subscribe(res => {
        this._common.showLoader(false);
        this._toastr.success("", `Profile updated successfully!!`, {
          timeOut: 3000
        });  
        this._common.navigate (this.HOME);
      },error => {
        this._toastr.error("", `${error.message}`, {
          timeOut: 3000
        });      
      })
    }
    
  }

}
