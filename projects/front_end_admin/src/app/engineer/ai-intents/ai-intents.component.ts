import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { AiIntentsService } from 'src/app/services/engineer/ai-intents.service';
import { DiseaseService } from 'src/app/services/engineer/disease.service';
import { LoaderService } from 'src/app/services/loader.service';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-ai-intents',
  templateUrl: './ai-intents.component.html',
  styleUrls: ['./ai-intents.component.css'],
})
export class AIIntentsComponent implements OnInit {
  getUserDataS: any = [];
  getSubData: any = [];
  page: number = 1;
  pageKey: number =1;
  allDiseases$: any;
  allKey$: any;
  pagination: any;
  paginationKey: any;
  idDisease: number = 0;
  KeyForm!: FormGroup;
  checkEdit: string = '';
  idIntent: number = 0;
  closeResult: string = '';
  checkStatusTraining: string = '';
  searchInputControl: FormControl = new FormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  searchKey: string = '';

  constructor(
    public _diseaseService: DiseaseService,
    public _aiintentsService: AiIntentsService,
    private _toastr: ToastrService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.userData();
    this.loadAllDisease();

    this.KeyForm = this._formBuilder.group({
      key: [''],
    });

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
   *
   * @param row
   */
  loadAllKey(id_disease) {
    this._aiintentsService
      .refreshListKey(this.pageKey, id_disease)
      .subscribe((res) => {
        this.allKey$ = res.data;
        this.paginationKey = res.pagination;
      });
  }
  /**
   * selected disease
   */
  onUpdate(row: any) {
    this.KeyForm.controls['key'].setValue(row.key);
    this.idIntent = row.id_intent;
    this.idDisease = row.id_disease;
  }

  showKey(id_disease) {
    this.loadAllKey(id_disease);
  }

  updateSelectedKey(): void {
    // Get the category object
    const key = this.KeyForm.getRawValue();
    key.id_intent = this.idIntent;
    key.id_disease = this.idDisease;

    // Update the product on the server
    this._aiintentsService.updateIntent(key).subscribe(
      (res) => {
        this.checkEdit = res as unknown as string;
        if (this.checkEdit === 'exitst') {
          this._toastr.error('Khoá đã tồn tại', 'Lỗi!');
        } else {
          this._toastr.success('Đã cập nhật khoá', 'Thành công');
          this.loadAllKey(key.id_disease);
          this.loadAllDisease();
          document.getElementById('btnCloseEdit')?.click();
        }
      },
      (err) => {
        this._toastr.error('Thử lại', 'Không thể kết nối...');
      }
    );
  }

  /**
   * selected disease
   */
  onDetail(row: any) {
    this.idDisease = 0;

    this._aiintentsService
      .refreshListKey(this.page, row.id_disease)
      .subscribe((res) => {
        this.allKey$ = res.data;
        this.pagination = res.pagination;
        this.idDisease = row.id_disease;
      });
  }

  /**
   * Change page
   */
   changePageKey(event: any): void {
    this.pageKey = event;
    this._aiintentsService
      .refreshListKey(this.pageKey, this.idDisease)
      .subscribe((res) => {
        this.allKey$ = res.data;
        this.paginationKey = res.pagination;
      });
  }

  /**
   *
   */
  changePageDisease(event: any): void {
    this.page = event;
    this.loadAllDisease();
  }

  /**
   * Delete the selected category
   */
  deleteSelectedKey(id: number): void {
    // Delete the product on the server
    this._aiintentsService.deleteIntent(id).subscribe(() => {
      this._toastr.success('Đã xóa khoá', 'Thành công');
      // Reload category list
      this.loadAllKey(this.idDisease);
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
            this.deleteSelectedKey(disID);
            this.loadAllKey(this.idDisease);
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

  onTrain(){
    this.loaderService.display(true)

    this._aiintentsService.trainData().subscribe((res) => {
      this.checkStatusTraining = res as unknown as string;
      if(this.checkStatusTraining == "training complete!"){
        this.loaderService.display(false);
        this._toastr.success('Train AI', 'Hoàn tất')
      }else{
        this.loaderService.display(false);
        this._toastr.error('Không ảnh hưởng tới dữ liệu trước đó','Train AI thất bại')
      }
    })
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
