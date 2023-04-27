import {
  Component,
  ElementRef,
  Injectable,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { DiseaseService } from 'src/app/services/engineer/disease.service';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'disease',
  templateUrl: './disease.component.html',
  styleUrls: ['./disease.css'],
})
export class DiseaseComponent implements OnInit {
  
  @ViewChild('btnClose') btnClose!: ElementRef;
  searchInputControl: FormControl = new FormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  allDiseases$: any;
  pagination: any;
  selectedDiseaseForm!: FormGroup;
  page: number = 1;
  closeResult: string = '';
  existDisease: string = '';
  getUserDataS: any = [];
  getSubData: any = [];
  searchKey: string = '';

  constructor(
    public _diseaseService: DiseaseService,
    private _toastr: ToastrService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {

    this.userData();

    // Create the form
    this.selectedDiseaseForm = this._formBuilder.group({
      id_disease: [''],
      name_disease: ['', [Validators.required]],
      symptom: [''],
      solution: [''],
    });

    this.loadAllDisease();

    // Search input category
    this.searchInputControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        switchMap((query) => {
          // Search category with service
          this.searchKey = query;
          return this._diseaseService.searchDiseases(this.searchKey);
        })
      )
      .subscribe((res) => {
        this.allDiseases$ = res.data;
        this.pagination = res.pagination;
    });
  }

  /**
   * load disease
   */
  loadAllDisease() {
    this._diseaseService.refreshListDisease(this.page).subscribe((response) => {
      this.allDiseases$ = response.data;
      this.pagination = response.pagination;
    });
  }

  /**
   * selected disease
   */
  onUpdate(row: any) {
    this.selectedDiseaseForm.controls['id_disease'].setValue(row.id_disease);
    this.selectedDiseaseForm.controls['name_disease'].setValue(
      row.name_disease
    );
    this.selectedDiseaseForm.controls['symptom'].setValue(row.symptom);
    this.selectedDiseaseForm.controls['solution'].setValue(row.solution);
  }

  /**
   * selected disease
   */
  onDetail(row: any) {
    this.selectedDiseaseForm.controls['id_disease'].setValue(row.id_disease);
    this.selectedDiseaseForm.controls['name_disease'].setValue(
      row.name_disease
    );
    this.selectedDiseaseForm.controls['symptom'].setValue(row.symptom);
    this.selectedDiseaseForm.controls['solution'].setValue(row.solution);
  }

  /**
   * Update the selected category using the form mock-api
   */
  updateSelectedDisease(): void {
    // Get the category object
    const disease = this.selectedDiseaseForm.getRawValue();

    // Update the product on the server
    this._diseaseService.updateDisease(disease).subscribe(
      (res) => {
        this.existDisease = res as unknown as string;
        if (this.existDisease === 'exitst') {
          this._toastr.error('Tên bệnh đã tồn tại', 'Lỗi!');
        } else {
          this._toastr.success('Đã cập nhật bệnh', 'Thành công');
          this.loadAllDisease();
          this.btnClose.nativeElement.click();
        }
      },
      (err) => {
        this._toastr.error('Thử lại', 'Không thể kết nối...');
      }
    );
  }

  /**
   * Delete the selected category
   */
  deleteSelectedDisease(id: number): void {
    // Delete the product on the server
    this._diseaseService.deleteDisease(id).subscribe(() => {
      this._toastr.success('Đã xóa bệnh', 'Thành công');
      // Reload category list
      this.loadAllDisease();
    });
  }

  // open dialog delete
  openDialog(content, disID) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          if (result === 'yes') {
            this.deleteSelectedDisease(disID);
          }
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  /**
   * Change page
   */
  changePage(event: any): void {
    this.page = event;
    this.loadAllDisease();
  }

  /**
   * get data local
   */
  userData() {
    if (localStorage.getItem('userData')) {
      this.getUserDataS = JSON.parse(localStorage.getItem('userData')!);
    }

    if (localStorage.getItem('subdata')) {
      this.getSubData = JSON.parse(localStorage.getItem('subdata')!);
    }
  }
}
