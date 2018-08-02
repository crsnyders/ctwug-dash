import * as firebase from 'firebase';
import { getLogger, logLevel, Logger } from 'aurelia-logging'
import { inject, NewInstance } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { ValidationController, ValidationRules } from 'aurelia-validation';
import { MaterializeFormValidationRenderer,MdToastService } from 'aurelia-materialize-bridge';

@inject(Router, MdToastService, NewInstance.of(ValidationController))
export class Login {

  private logger: Logger;
  private email: string;
  private password: string;
  private isDisabled = true;
  private loading: boolean = false;

  rules = ValidationRules
    .ensure('email')
      .required()
        .withMessage('We need your email')
      .email()
      .ensure('password').required()
      //.satisfiesRule('matchesProperty', 'password')
    .rules;
  constructor(private router: Router, private toast: MdToastService, private controller: ValidationController) {
    this.logger = getLogger("Login Page")
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.router.navigate("");
      }
    });
    this.controller.addRenderer(new MaterializeFormValidationRenderer());
  }

  login() {
    this.loading = true;
    firebase.auth().signInWithEmailAndPassword(this.email, this.password)
      .then((response) => {
        this.loading = false;
        this.logger.info(`User '${this.email}' successfully logged in`, response);
        if(!response.user.emailVerified){
          this.toast.show("You haven't validated your email yet",2000, "red")
        }
      })
      .catch((error: { code: string, message: string }) => {
        this.loading = false;
        this.logger.error(`Could not sign user in ${this.email}`, error)
        if (error.code == 'auth/wrong-password' || error.code == 'auth/weak-password') {
          this.toast.show("Username or Password incorrect", 4000, 'red');
        }
        else if (error.code == "auth/email-already-in-use" || error.code == "auth/invalid-email") {
          this.toast.show("Username or Password incorrect", 4000, 'red');
        }
        else if (error.code == "auth/operation-not-allowed") {
          this.toast.show("Oop! Something went wrong, try again in a bit.", 4000, 'red');
        }
        else if (error.code == 'auth/user-not-found') {
          this.toast.show("You need to register first", 4000, 'red');
        }
      })
  }

  validate(){
    this.controller.validate().then(v => {
      if (v.valid) {
        this.isDisabled  = false;
      } else {
        this.isDisabled = true;
      }
    });
  }
  signUp() {
    this.router.navigateToRoute("register");
  }

  recoverPassword() {
    firebase.auth().sendPasswordResetEmail(this.email)
      .then((response) => {
        this.logger.info(`User password reset email sent to '${this.email}' `, response);
      })
      .catch((error) => {
        this.logger.error(`Could not send password reset email to ${this.email}`, error)
      })
  }
}
