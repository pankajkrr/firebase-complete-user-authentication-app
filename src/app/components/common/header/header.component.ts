import { Component, OnInit } from '@angular/core';
import { FirebaseService, CommonService } from '../../../services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  readonly LOGIN   = '/login';
  constructor(
    private _firebase:FirebaseService,
    private _common:CommonService
  ) { }

  ngOnInit() {
  }
  SignOut(){
    this._firebase.SignOut().then(res => {
      sessionStorage.removeItem ('user');
        this._common.navigate(this.LOGIN);
    }).catch(err=>{

    })
  }

}
