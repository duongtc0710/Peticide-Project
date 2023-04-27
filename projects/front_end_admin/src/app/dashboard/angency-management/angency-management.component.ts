import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { API_URL } from 'src/app/config/url.constants';
import { AgencyService } from 'src/app/services/agency.service';

@Component({
  selector: 'app-angency-management',
  templateUrl: './angency-management.component.html',
  styleUrls: ['./angency-management.component.css'],
})
export class AngencyManagementComponent implements OnInit {
  
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  p: number = 1;
  page: number = 1;
  allAgency$: any;
  pagination: any;
  selectedAgencyForm!: FormGroup;
  existAgency: string = '';
  searchInputControl: FormControl = new FormControl();
  getUserDataS: any = [];
  getSubData: any = [];
  searchKey: string = '';

  constructor(
    public _agencyService: AgencyService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userData();
    // Create the form
    this.selectedAgencyForm = this._formBuilder.group({
      id_acc: [''],
      id_agency: ['', [Validators.required]],
      fullname: ['', [Validators.required]],
      rate: ['', [Validators.required]],
    });

    this.loadAllAgency();

    // Search input category
    this.searchInputControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        switchMap((query) => {
          // Search category with service
          this.searchKey = query;
          return this._agencyService.searchAgencys(this.searchKey);
        })
      )
      .subscribe((res) => {
        this.allAgency$ = res.data;
        this.pagination = res.pagination;
    });
  }

  /**
   * load all account
   */
  loadAllAgency() {
    this._agencyService.refreshListAgency(this.page).subscribe((res) => {
      this.allAgency$ = res.data;
      this.pagination = res.pagination;
    });
  }

  /**
   * Change page
   */
  changePage(event: any): void {
    this.page = event;
    this.loadAllAgency();
  }

  userData() {
    if (localStorage.getItem('userData')) {
      this.getUserDataS = JSON.parse(localStorage.getItem('userData')!);
    }

    if (localStorage.getItem('subdata')) {
      this.getSubData = JSON.parse(localStorage.getItem('subdata')!);
    }
  }
}
