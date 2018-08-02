import {inject,computedFrom} from "aurelia-framework";
import {Router} from "aurelia-router";
import * as firebase from 'firebase';
import { getLogger, logLevel, Logger } from 'aurelia-logging'
import {User} from '../custom_typings/model';
import 'nav-bar.css';

@inject(Router)
export class NavBar{

private logger: Logger;
private currentUser: firebase.User;
private userInfo :  User;
private unsubscriber;
private userListner:()=>void;
primaryColor = '#0064cd';
accentColor = '#049cdb';
errorColor = '#FF0000';

  constructor(private router: Router){
    this.logger = getLogger("NavBar");
    this.unsubscriber = firebase.auth().onAuthStateChanged((user: firebase.User | null)=>{
      this.currentUser = user;
      if(this.currentUser){
      this.logger.info(`Fetching user info for ${this.currentUser.uid}`)
      this.userListner = firebase.firestore().doc("users/"+user.uid).onSnapshot((snapshot)=>{
        this.userInfo = <User>snapshot.data();
        this.logger.info(`Retrieved user info`, this.userInfo )
      })
    }
    })
  }

@computedFrom('currentUser')
get isAuthenticated(){
  return this.currentUser != null && this.currentUser.emailVerified;
}
@computedFrom('currentUser')
get userDisplayName(){

  return this.currentUser ? (this.currentUser.displayName ? this.currentUser.displayName : this.currentUser.email): "";
}
logout(){
  firebase.auth().signOut().then(()=>{
    this.router.navigateToRoute("login");
  });
}

detached(){
  this.userListner();
  this.unsubscriber();

}
}
