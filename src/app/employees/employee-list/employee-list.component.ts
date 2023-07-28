import { Component, OnInit } from '@angular/core';
import { NgbCalendar, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import * as $ from "jquery";

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css'],
})
export class EmployeeListComponent implements OnInit {
  roles = [{ key: 1, value: 'Product Designer' },
  { key: 2, value: 'Flutter Developer' },
  { key: 3, value: 'QA Tester' },
  { key: 4, value: 'Product Owner' }];
  addFlag : boolean = false;
  fullNameValue =''
  selectedRole = '';
  roleValue = '';
  fullName = '';
  model1: string;
  model2: string;
  label = '';
  labelshow = false;
  employeeList = [];
  updateFlag: boolean = false;
  currentkey: any;
  constructor(private ngbCalendar: NgbCalendar, private dateAdapter: NgbDateAdapter<string>) { $(function() {
    setTimeout(function() { $("#hideDiv").fadeOut(1500); }, 1000)
    })}
  ngOnInit(): void {
    this.getEmployeeData();
  }

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  getName($event): void {
    this.fullName = $event.target.value;
  }

  roleChange($event): void {
    this.selectedRole = $event.target.value;
  }

  saveEmployeeData(): void {
    let idb = indexedDB.open('EmployeeList', 1);
    idb.onupgradeneeded = () => {
      let res = idb.result;
      res.createObjectStore('data', { autoIncrement: true });
    }
    idb.onsuccess = () => {
      let res = idb.result;
      let tx = res.transaction('data', 'readwrite');
      let store = tx.objectStore('data');
      store.put({
        name: this.fullName,
        role: this.selectedRole,
        fromDate: this.model1,
        toDate: this.model2
      });
    }
    this.getEmployeeData();
    this.addFlag = false;
  }

  getEmployeeData(): void {
    this.employeeList = [];
    let idb = indexedDB.open('EmployeeList', 1);
    // idb.onupgradeneeded = () => {
    //   let res = idb.result;
    //   let objectstore = res.createObjectStore('data', { autoIncrement: true });
    //   objectstore.createIndex("name", "name", { unique: false });
    //   objectstore.createIndex("role", "role", { unique: false });
    //   objectstore.createIndex("toDate", "toDate", { unique: false });
    //   objectstore.createIndex("fromDate", "fromDate", { unique: false });
    // }
    idb.onsuccess = () => {
      let res = idb.result;
      let tx = res.transaction('data', 'readonly');
      let store = tx.objectStore('data');
      let cursor = store.openCursor();
      cursor.onsuccess = () => {
        let curRes = cursor.result;
        if (curRes) {
          this.employeeList.push({ name: curRes.value.name, key: curRes.key, role: curRes.value.role, toDate: curRes.value.toDate, fromDate: curRes.value.fromDate });
          curRes.continue();
        }
      }

    }
    if(this.employeeList.length){
      this.addFlag = false;
    }
  }

  deleteEmpData(e): void {
    let idb = indexedDB.open('EmployeeList', 1);
    idb.onsuccess = () => {
      let res = idb.result;
      let tx = res.transaction('data', 'readwrite');
      let store = tx.objectStore('data');
      store.delete(e);
    }
    this.getEmployeeData()
  }

  updateEmp(key):void {
    this.addFlag = true;
    this.currentkey = key;
    const empUpdate = this.employeeList.find(ele=>ele.key === key);
    this.fullNameValue = empUpdate.name;
    this.roleValue = empUpdate.role;
    this.model1 = empUpdate.fromDate;
    this.model2 = empUpdate.toDate;
    this.updateFlag = true;
  }

  updateButton(){
    let idb = indexedDB.open('EmployeeList', 1);
    idb.onsuccess = () => {
      let res = idb.result;
      let tx = res.transaction('data', 'readwrite');
      let store = tx.objectStore('data');
      store.put({
        name: this.fullName,
        role: this.selectedRole,
        fromDate: this.model1,
        toDate: this.model2
      },this.currentkey);
    }
    this.addFlag = false;
    this.updateFlag=false;
    this.getEmployeeData();
  }
  
  addNewEmp(){
    this.addFlag=true;
    this.fullNameValue = '';
    this.roleValue ='';
    this.model1 ='';
    this.model2 = '';
  }

}
