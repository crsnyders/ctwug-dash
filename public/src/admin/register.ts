import * as firebase from 'firebase';
import 'firebase/firestore';
import {inject,NewInstance} from 'aurelia-framework';
import {Router} from 'aurelia-router'
import {getLogger, Logger} from 'aurelia-logging';
import { ValidationController, ValidationRules } from 'aurelia-validation';
import { MaterializeFormValidationRenderer,MdToastService } from 'aurelia-materialize-bridge';
import {User} from '../../../custom_typings/model';

@inject(Router,NewInstance.of(ValidationController),MdToastService)
export class Register{
  public logger : Logger;
  private organisations: Array<any>;
  private firstName: string;
  private lastName: string;
  private avatarUrl: string;
  private email: string;
  private password: string;
  private confirmPassword: string;
  private verificationSent: boolean = false;
  private loading: boolean = false;

  private rules = ValidationRules
    .ensure('firstName')
      .required()
    .ensure('lastName')
      .required()
    .ensure('email')
      .required()
        .withMessage('We need your email')
      .email()
    .withMessage("Enter the number of people in the house.")
    .ensure('password').required()
    .ensure('confirmPassword').required()
    .satisfies((value)=>{
      return value == this.password;
    })
    .withMessage('Password does not match!')
    .rules;


  constructor( private router: Router,private controller: ValidationController, private toast:MdToastService){

    this.logger = getLogger('Register');
    this.controller.addRenderer(new MaterializeFormValidationRenderer());
    ValidationRules.customRule(
        'matchesProperty',
        (value, obj, otherPropertyName) =>
          {return value === null
          || value === undefined
          || value === ''
          || obj[otherPropertyName] === null
          || obj[otherPropertyName] === undefined
          || obj[otherPropertyName] === ''
          || value === obj[otherPropertyName]},
        '${$displayName} must match ${$getDisplayName($config.otherPropertyName)}', otherPropertyName => ({ otherPropertyName })
      );
  }
  activate(){
    this.organisations = []
    firebase.firestore().collection('organisations').get().then((snapshot: firebase.firestore.QuerySnapshot)=>{
      snapshot.forEach((child:firebase.firestore.QueryDocumentSnapshot)=>{
        var org = child.data()
        org.uid = child.id;
        this.organisations.push(org);
        return false;
      })
    })
  }
  deactivate(){
    this.organisations = undefined;
  }

  submit(){
    this.controller.validate().then(result => {
        if (result.valid) {
          this.logger.info("validated")
          this.loading = true;
          firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
              .then((response) => {
                var currentUser = firebase.auth().currentUser;
                this.logger.info(`Created user ${this.email}`, response)

                var user = <User>{
                  firstName: this.firstName,
                  lastName: this.lastName,
                  avatarUrl: this.avatarUrl ? this.avatarUrl : `https://robohash.org/${this.firstName} ${this.lastName}?set=set4&size=100x100`
                }
                this.logger.info("adding user to db", user)
                firebase.firestore().doc("users/"+currentUser.uid).set(user).then(()=>{
                  this.loading = false;
                    currentUser.sendEmailVerification().then(()=>{
                      this.verificationSent = true;
                      this.toast.show(`Verification email sent to: ${this.email}`, 4000,'green')

                    }).catch((error)=>{
                      this.loading = false;
                      this.logger.error("Problem sending verification email, deleting user",error);
                      currentUser.delete();
                    });

                })
                .catch((error)=>{
                  this.loading = false;
                  this.logger.error("Problem sending verification email, deleting user",error);
                  currentUser.delete();
                })

              })
              .catch((error: { code: string, message: string }) => {
                this.loading = false;
                this.logger.error(`Could not register user ${this.email}`, error)
                if (error.code == 'auth/email-already-in-use') {
                  this.toast.show("You have already registered", 4000, 'red');
                }


              });
        } else {
          this.logger.error("could not validate")
        }
      });


  }

  cancel(){
    this.logger.info("Register canceled");
    this.router.navigateToRoute("login");
  }
}
