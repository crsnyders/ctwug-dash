import * as firebase from 'firebase';
import 'firebase/firestore';
import {inject,NewInstance} from 'aurelia-framework';
import {Router} from 'aurelia-router'
import {getLogger, Logger} from 'aurelia-logging';
import { ValidationController, ValidationRules } from 'aurelia-validation';
import { MaterializeFormValidationRenderer,MdToastService } from 'aurelia-materialize-bridge';

@inject(Router,NewInstance.of(ValidationController),MdToastService)
export class PasswordReset{
  public logger : Logger;
  private email: string;

  private verificationSent: boolean = false;
  private loading: boolean = false;

  private rules = ValidationRules
    .ensure('email')
      .required()
        .withMessage('We need your email')
    .rules;


  constructor( private router: Router,private controller: ValidationController, private toast:MdToastService){
    this.logger = getLogger('Password Recovery');
    this.controller.addRenderer(new MaterializeFormValidationRenderer());
  }

  passwordReset(){
    firebase.auth().sendPasswordResetEmail(this.email).then(()=>{
        this.toast.show("Password reset email sent", 2000, "green").then(()=>{
          this.router.navigateToRoute("login");
        })
    })
  }
}
