import {Component, OnInit, ElementRef}                from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {AppService}                         from './app.service';
import 'rxjs/add/observable/of';
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
  styleUrls: ['./app.component.scss'],
  host: {
    '(document:click)': 'onClick($event)',
  }
})

export class AppComponent implements OnInit {
  title = 'app works!';
  managerName = '';
  preloadData;
  createProjForm: FormGroup;
  private checkName = false;
  private checkManager = false;
  private checkStart_at = false;
  private managers = [];
  selectedUser:UserModel;

  constructor(private XProjectApi: AppService,
              private fb: FormBuilder,
              private _eref: ElementRef) {
    this.createProjForm = fb.group({
      'manager': [null, Validators.required]
    });
    this.createProjForm.valueChanges.subscribe((form: any) => {
        if (form.manager !== null) {
          this.serchName(this.preloadData.managers, form.manager);
        }
      }
    );
    this.selectedUser = new UserModel;
  }

  ngOnInit() {
    this.XProjectApi.getPreloadData()
      .subscribe((response) => {
        this.preloadData = response;
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
          items.push(value)
        }
      }
    }
    this.managers = items;
  }

  choseManager(manager){
    this.createProjForm.value.manager = manager.Id;
    this.managerName = manager.name;
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

  onClick(event) {
    if (!this._eref.nativeElement.contains(event.target)) // or some similar check
      this.managers = [];
  }

  closeForm() {
  }

}
