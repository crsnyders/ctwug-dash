import {inject} from "aurelia-framework";
import 'isomorphic-fetch';
import {HttpClient, json}  from "aurelia-fetch-client";
import {Router} from "aurelia-router";
import * as _ from "lodash";

@inject(HttpClient, Router)
export class HttpService {
  constructor(private client: HttpClient, private router: Router) {
    client.configure(config => {
      config
        .withDefaults({
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'Fetch'
          }
        })
        .withInterceptor({
          request(request) {
            console.debug(`Requesting ${request.method} ${request.url}`);
            return request; // you can return a modified Request, or you can short-circuit the request by returning a Response
          },
          response(response) {
            console.debug(`Received ${response.status} ${response.url}`);
            return response; // you can return a modified Response
          }
        });
    });
  }
  json(body: any) {
    return json(body);
  }
  fetch<T>(url: string | Request, requestInit?: RequestInit): Promise<T> {
    var promise = new Promise((resolve, reject) => {
      requestInit = _.extend(requestInit, { credentials: 'same-origin' });
      this.client.fetch(url, requestInit)
        .then((x) => {
          if (x.ok) {
            return x.json()
          }else {
            reject(x);
          }
        })
        .then((x) => {
          resolve(x);
        }).catch((x => {
          reject(x);
        }))
    })
    return promise;
  }
}
