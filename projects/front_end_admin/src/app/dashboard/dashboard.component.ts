import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/login/login.service';
import { AnalyticsService } from '../services/analytics.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [],
  providers: [DatePipe]
})
export class DashboardComponent implements OnInit {
  allAnalytics$: any;
  allAnalyticsAgency$: any;
  getUserDataS: any = [];
  getSubData: any = [];
  idAgency: number = 0;
  filterByDateForm!: FormGroup;
  searchInputControl: FormControl = new FormControl();
  defaultForm!:FormGroup;
  profit: number = 0;
  order_success: number = 0;
  order_fail: number = 0;
  total_order: number = 0;
  myDate = new Date;
  toDay: any;

  constructor(
    public service: LoginService,
    public _analyticsService: AnalyticsService,
    private router: Router,
    private _toastr: ToastrService,
    private _formBuilder: FormBuilder,
    private datePipe: DatePipe
  ) {
  }

  ngOnInit(): void {
    this.userData();

    this.filterByDateForm = this._formBuilder.group({
      id_agency: 0,
      start_date: [''],
      end_date: ['']
    });

    this.defaultForm = this._formBuilder.group({
      id_agency: this.idAgency,
      start_date: [this.myDate.getFullYear() + "-0" + (this.myDate.getMonth()+1) + "-01"],
      end_date: [this.myDate.getFullYear() + "-0" + (this.myDate.getMonth()+2) + "-01"]
    });
    

    if (this.getUserDataS['id_role'] == 1) {
      this.loadAllAnalytics();
    } else if (this.getUserDataS['id_role'] == 3) {
      this._analyticsService.refreshListAnalyticsForAgency(this.defaultForm.value).subscribe((res) => {
        this.allAnalyticsAgency$ = res;
    });
    }
    
  }

  /**
   * filter by date
   */
   filterByDate(event){
    if((this.filterByDateForm.get('start_date')?.value != '' && this.filterByDateForm.get('end_date')?.value != '') 
      && (this.filterByDateForm.get('end_date')?.value) > (this.filterByDateForm.get('start_date')?.value)){
      if(this.getUserDataS['id_role'] === 1){
        this._analyticsService.refreshListAnalyticsForAgency(this.filterByDateForm.value).subscribe((response)=>{
          this.allAnalytics$ = response
        })
      } else if(this.getUserDataS['id_role'] === 3){
        this.filterByDateForm.controls['id_agency'].setValue(this.idAgency);
        this._analyticsService.refreshListAnalyticsForAgency(this.filterByDateForm.value).subscribe((response)=>{
          this.allAnalyticsAgency$ = response;
        })
      }
    } else {
      this._toastr.warning('Ngày của bạn chọn không hợp lệ');
    }
  }

  onLogout() {
    this.router.navigate(['/login']);
  }

  loadAllAnalytics() {
    this._analyticsService.refreshListAnalytics().subscribe(
      (result) => {
        this.allAnalytics$ = result;
      },
      (error) => console.log(error)
    );
  }

  loadAllAnalyticsForAgency() {
    this._analyticsService.refreshListAnalyticsForAgency(this.defaultForm.value).subscribe((res) => {
        this.allAnalyticsAgency$ = res;
    });
  }

  userData() {
    if (localStorage.getItem('userData')) {
      this.getUserDataS = JSON.parse(localStorage.getItem('userData')!);
    }

    if (localStorage.getItem('subdata')) {
      this.getSubData = JSON.parse(localStorage.getItem('subdata')!);
    }

    if (this.getUserDataS['id_role'] == 3) {
      this.idAgency = this.getSubData['id_agency'];
    }
  }
}
