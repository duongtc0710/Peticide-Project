import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Disease } from 'src/app/models/engineer/disease.model';
import { DiseaseService } from 'src/app/services/engineer/disease.service';
import { DiseaseComponent } from '../disease.component';

@Component({
  selector: 'app-add-disease',
  templateUrl: './add-disease.component.html',
  styleUrls: ['disease.css'],
})
export class AddDiseaseComponent implements OnInit {
  @ViewChild('btnClose') btnClose!: ElementRef;
  checkInsertName: string = '';
  diseaseForm!: FormGroup;
  closeResult: string = '';

  constructor(
    public _diseaseService: DiseaseService,
    private _toastr: ToastrService,
    private _formBuilder: FormBuilder,
    private _manageDisease: DiseaseComponent
  ) {}

  ngOnInit(): void {
    // Create the form
    this.diseaseForm = this._formBuilder.group({
      id_disease: [''],
      name_disease: ['', [Validators.required]],
      symptom: [''],
      solution: [''],
    });
  }

  /**
   * Check error input
   */
  hasError = (controlName: string, errorName: string) => {
    return this.diseaseForm.controls[controlName].hasError(errorName);
  };

  /**
   * Create disease
   */
  createDisease(disease: Disease) {
    this._diseaseService.createDisease(disease).subscribe(
      (res) => {
        this.checkInsertName = res as unknown as string;
        if (this.checkInsertName === 'ok') {
          this.diseaseForm.reset();
          this.btnClose.nativeElement.click();
          this._manageDisease.loadAllDisease();
          this._toastr.success('Bệnh đã được thêm', 'Thành công');
        } else if (disease.name_disease === null) {
          this._toastr.warning('Vui lòng nhập thông tin', 'Lỗi!!');
        } else {
          this._toastr.error('Tên bệnh đã tồn tại!', 'Lỗi!!');
        }
      },
      (err) => {
        this._toastr.error('Thử lại', 'Không thể kết nối...');
      }
    );
  }

  /**
   * Send the message
   */
  onSubmit(): void {
    const disease = this.diseaseForm.value;
    this.createDisease(disease);
    this.diseaseForm.reset();
  }
}
