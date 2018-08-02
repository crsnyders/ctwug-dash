import { NewInstance, computedFrom, inject } from 'aurelia-framework';
import { Logger, getLogger } from 'aurelia-logging';
import { MaterializeFormValidationRenderer, MdToastService } from 'aurelia-materialize-bridge';
import { ValidationController, ValidationRules } from 'aurelia-validation';
import * as firebase from 'firebase';
import 'firebase/firestore';
import * as _ from 'lodash';
import { User } from '../../../custom_typings/model';
import "./profile.css";

@inject(MdToastService, NewInstance.of(ValidationController))
export class Profile {

  private logger: Logger;
  private currentUser: firebase.User;
  private currentUserInfo: User;
  private loading: boolean = false;
  private currentPassword: string;
  private newPassword: string;
  private confirmPassword: string;
  private passwordUpdate;
  private updateDetails;
  private changeAvatarModal;
  private profileRef: firebase.firestore.DocumentReference;;
  private fileInput: any;
  private imageUploading: boolean = false;
  private profileRefUnsubscribe: () => void;

  private rules = ValidationRules
    .ensure('firstName')
    .required()
    .ensure('lastName')
    .required()
    .ensure('currentPassword').required()
    .ensure('newPassword').required()
    .ensure('confirmPassword').required()
    .satisfies((value) => {
      return value == this.newPassword;
    })
    .withMessage('Password does not match!')
    .rules;

  constructor(private toast: MdToastService, private controller: ValidationController) {
    this.logger = getLogger("Profile")
    this.controller.addRenderer(new MaterializeFormValidationRenderer());
  }
  activate() {
    this.currentUser = firebase.auth().currentUser;
    this.profileRef = firebase.firestore().doc("users/" + this.currentUser.uid)
    this.profileRefUnsubscribe = this.profileRef.onSnapshot((snapshot: firebase.firestore.DocumentSnapshot) => {
      this.logger.debug("Firestore user into", snapshot.data());
      this.currentUserInfo = <User>snapshot.data();
    }, (error: Error) => {
      this.logger.error("Could not fetch user collection", error)
    })

  }
  deactivate() {
    this.logger.debug("Unsubscribing profile changelistner");
    this.profileRefUnsubscribe();
  }
  updateUserInfo() {
    firebase.firestore().doc('users/' + this.currentUser.uid).update(this.currentUserInfo).then(() => {
      this.toast.show("Profile updated", 2000, "green");
    }).catch((error: Error) => {
      this.toast.show("Oops could nop update profile", 2000, "red")
      this.logger.error("Could not update profile", error, this.currentUserInfo);
    })
  }

  changeAvatar() {
    this.changeAvatarModal.open();
  }
  cancelChangeAvatar() {
    this.clearFileInput();
  }
  updateAvatar() {
    this.imageUploading = true;
    var storageRef = firebase.storage().ref();
    var imageRef = storageRef.child("users/" + this.currentUser.uid);
    this.logger.debug("Retrieved imageRef", imageRef, );
    if (this.fileInput.files.length > 0) {
      this.logger.debug("Image to upload", this.fileInput.files[0])
      imageRef.put(this.fileInput.files[0]).then((snapshot) => {
        this.profileRef.set({ 'avatar': snapshot.downloadURL }, { merge: true }).then(() => {
          this.logger.info(`User ${this.currentUser.uid} avatar updated`);
          this.clearFileInput();
        }).catch((error: Error) => {
          this.logger.error("Could not update avatar", error)
          this.toast.show("Oops! There was a problem updating the avatar", 1000, "red")
          this.clearFileInput();
        })


      }).catch((error) => {
        this.logger.error("Coult not store image", error);
        this.toast.show("Oops! There was a problem updating the avatar", 1000, "red")
        this.clearFileInput();
      });
    }

  }
  clearFileInput() {
    this.fileInput.files = [];
    this.imageUploading = false;
  }
  editProfile() {
    this.updateDetails.open();
  }
  cancelEditProfile() {
    this.updateDetails.close();
  }

  changePassword() {
    this.passwordUpdate.open();
  }
  updatePassword() {
    let credential = firebase.auth.EmailAuthProvider.credential(this.currentUser.email, this.currentPassword);
    this.loading = true;
    this.currentUser.reauthenticateWithCredential(credential).then(() => {
      this.currentUser.updatePassword(this.newPassword).then(() => {
        this.logger.info(`User ${this.currentUser.email} successfully updated password`)
        this.toast.show("Password update sucessfull", 400, "green");
        this.loading = false;
        this.passwordUpdate.close();
      }).catch((error) => {
        this.logger.error(`Failed to update password for user ${this.currentUser.email}`, error);
        this.loading = false;
        this.passwordUpdate.close();
      });
    }).catch(function (error) {
      this.logger.error(`Failed to reauthenticate user ${this.currentUser.email}`, error);
      this.loading = false;
      this.passwordUpdate.close();
    });

  }
  cancelPasswordUpdate() {
    this.passwordUpdate.close();
    this.currentPassword = undefined;
    this.newPassword = undefined;
    this.confirmPassword = undefined;
  }
  @computedFrom('fileInput.files')
  get selectedFile() {
    this.logger.info(this.fileInput);
    return _.get(this.fileInput, 'files.length', 0) > 0 ? this.fileInput.files[0] : '';
  }
}
