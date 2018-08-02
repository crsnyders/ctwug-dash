import { inject } from "aurelia-framework";
import { PipelineStep, NavigationInstruction, Next, Redirect } from "aurelia-router"
import * as firebase from 'firebase';
import 'firebase/firestore';
import { getLogger, logLevel, Logger } from 'aurelia-logging'


export class AuthorizeStep implements PipelineStep {
  private logger: Logger;
  constructor() {
    this.logger = getLogger("AuthorizeStep");
  }
  run(routingContext: NavigationInstruction, next: Next) {

    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(user => {
        let currentRoute = routingContext.config.settings;
        let loginRequired = currentRoute.auth && currentRoute.auth === true;
        this.logger.debug(`Can access route? ${routingContext.fragment} (login required: ${loginRequired}) (is logged in & email verified: ${(user && user.emailVerified)}) `)
        if (loginRequired && !user || (loginRequired && user && !user.emailVerified)) {
          return resolve(next.cancel(new Redirect('login')));
        }

        return resolve(next());
      },(error: firebase.auth.Error)=>{
        this.logger.error("Could not get auth state change", error);
      });
    });


  }
}
