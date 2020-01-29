import { Injectable} from '@angular/core';

import { User } from '../_model/user';

import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import {Observable} from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  userData: any; // Save logged in user data
  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    private http: HttpClient
  ) {
    /* Saving user data in sessionstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        sessionStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(sessionStorage.getItem('user'));
      } else {
        sessionStorage.setItem('user', null);
        JSON.parse(sessionStorage.getItem('user'));
      }
    })
  }

  // Sign in with email/password
  SignIn(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  // Sign up with email/password
  SignUp(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }


  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification();
  }

  //Forgot password
  ForgotPassword(passwordResetEmail) {
    return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail);
  }

  // Sign out 
  SignOut() {
    return this.afAuth.auth.signOut();
  }
  // Add new client

  AddNewClient(data):Observable<any>{
    return this.http.post("add-client", data, this.noAuthHeader);
  }

  // Get Client list...
  GetClientList():Observable<any>{
    return this.http.get("client-list", this.noAuthHeader);
  }

  // Schedule Appointment
  ScheduleAppointment(data):Observable<any>{
    return this.http.post("schedule-appointment", data, this.noAuthHeader);
  }

  // get appointment list..
  GetAppointmentList(clientId):Observable<any>{
    return this.http.get("appointment-list?clientId="+clientId, this.noAuthHeader);
  }

  // Update Profile
  UpdateProfile(profile):Observable<any>{
    return this.http.post("update-profile", profile, this.noAuthHeader);
  }
  // GEt Profile data... 
  getProfileData(uid):Observable<any>{
    return this.http.get("get-user-profile?uid="+uid, this.noAuthHeader);
  }
  

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      firstName: user.displayName,
      lastName : '',
      password : '',
      status: true
    }
    return userRef.set(userData, {
      merge: true
    })
  }
}
