import { Component, OnInit } from '@angular/core';
import { FirebaseService, CommonService } from '../../services';

//Toast
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css'],
  providers: [FirebaseService, CommonService]
})
export class ClientListComponent implements OnInit {
  clientList=[];
  constructor(
    private _firebase : FirebaseService,
    private _common : CommonService,
    private _toastr : ToastrService
  ) { }

  ngOnInit() {
    this.getClientList();
  }

  // Method to get client list...
  getClientList(){
    this._common.showLoader(true);
    this._firebase.GetClientList().subscribe(res => {
      res.result.map(item=> {
        this._common.showLoader(false);
        item.dateTime = new Date(item.createdOn._seconds*1000);
        this.clientList.push(item);
      });
    },error => {
      this._toastr.error("", `${error.message}`, {
        timeOut: 3000
      });      
    })
  }

}
