import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers } from '@angular/http';

import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

export class UserModel {
  id: number;
  name: string;
}


@Injectable()

export class AppService {

  get headers() {
    return new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  constructor(
    private http: Http
  ) { }

  search(term: string): Observable<UserModel[]> {
    return this.http
      .get(`http://192.168.0.106:3000/database/managers/?name=${term}`)
      .map(response => response.json().data as UserModel[]);
  }

  getPreloadData() {
    return this.getData(`http://192.168.0.106:3000/database`);
  }
  private getData(url) {
    return this.http.get(url, {headers: this.headers})
      .map(res => this.extractData(res))
      .catch(error => this.handleError(error));
  }


  private extractData(res: Response) {
    let body = res.json();
    console.log(body);
    return body.data || { };
  }

  private handleError (error: Response | any) {
    if (error.status === 401) {
      return Observable.throw(error.json().message);
    } else if (error.status === 400) {
      return Observable.throw(error.json().message);
    }
  }
}
