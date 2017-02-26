import { Component, OnInit }                from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {AppService}                         from './app.service';
import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';
// Observable class extensions
import 'rxjs/add/observable/of';
// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

export class UserModel {
  id: number;
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'app works!';
  name = '';
  isVisible = true;
  preloadData;
  createProjForm: FormGroup;
  private checkName = false;
  private checkManager = false;
  private checkStart_at = false;
  private managers = [];
  private searchTerms = new Subject<string>();
  selectedUser:UserModel;


  constructor(private XProjectApi: AppService,
              private fb: FormBuilder) {
    this.createProjForm = fb.group({
      'manager': [null, Validators.required]
    });
    console.log(this.createProjForm);
    this.createProjForm.valueChanges.subscribe((form: any) => {
        console.log('form changed to:', form);
        if (form.manager !== null) {
          this.serchName(this.preloadData.managers, form.manager);
        }
      }
    );
    this.selectedUser = new UserModel;
  }

  search(term: string): void {
    console.log(term);
    this.serchName(this.preloadData.managers, term);
  }
  ngOnInit() {

    this.XProjectApi.getPreloadData()
      .subscribe((response) => {
        console.log(JSON.stringify(response));
        this.preloadData = response;
        console.log(this.preloadData.managers);
      });
  }

  serchName(obj, query) {
    let items = [];

    for (let key in obj) {
      const value = obj[key];

      if (typeof value === 'object') {
        this.serchName(value, query);
      }

      if (value.name) {
        if (value.name.toLowerCase().indexOf(query.toLowerCase()) > -1 && query !== '') {
          console.log(value.name);
          console.log(this.managers);
          items.push(value)
        }
      }
    }
    this.managers = items;
    console.log(this.managers);
  }

  choseManager(manager){
    this.createProjForm.value.manager = manager.Id;
    this.name = manager.name;
    console.log(this);
    console.log(manager);
    console.log(this.createProjForm);
  }

  submitForm(formGroup: any) {
    console.log(formGroup);
    if (formGroup.valid) {
      console.log('form data send');
    } else {
      console.log(formGroup.value);
      if (formGroup.value.name === null) {
        this.checkName = true;
      }
      if (formGroup.value.manager === null) {
        this.checkManager = true;
      }
      if (formGroup.value.start_at === '') {
        this.checkStart_at = true;
      }
    }
  }


  closeForm() {
  }
}
