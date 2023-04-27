import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AIintents } from 'src/app/models/engineer/ai-intent.model';
import { AiIntentsService } from 'src/app/services/engineer/ai-intents.service';
import { DiseaseService } from 'src/app/services/engineer/disease.service';
import { AIIntentsComponent } from '../ai-intents.component';

@Component({
  selector: 'app-add-intents',
  templateUrl: './add-intents.component.html',
  styleUrls: ['./add-intents.component.css'],
})
export class AddIntentsComponent implements OnInit {
  getUserDataS: any = [];
  getSubData: any = [];
  page: number = 1;
  allDiseases$: any;
  KeyDiseaseForm!: FormGroup;
  allKey$: any;
  pagination: any;
  idDisease: number = 0;
  checkCreate: string = '';
  constructor(
    public _diseaseService: DiseaseService,
    public _aiintentsService: AiIntentsService,
    public _aiintentsManage: AIIntentsComponent,
    private _toastr: ToastrService,
    private modalService: NgbModal,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userData();
    this.loadAllDisease();

    this.KeyDiseaseForm = this._formBuilder.group({
      id_disease: [''],
      key: [''],
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
   * Send the message
   */
  onSubmit(): void {
    const disease = this.KeyDiseaseForm.getRawValue();
    this.idDisease = disease.id_disease;
    this.createKeyDisease(disease);
    this.KeyDiseaseForm.reset();
  }

  createKeyDisease(intents: AIintents) {
    this._aiintentsService.createIntent(intents).subscribe((res) => {
      this.checkCreate = res as unknown as string;
      if (this.checkCreate === 'ok') {
        this._toastr.success('Khoá đã được thêm', 'Thành công');
        this.KeyDiseaseForm.reset();
        document.getElementById('btnClose')?.click();
        this._aiintentsManage.loadAllDisease();
        this._aiintentsManage.loadAllKey(this.idDisease);
      } else if (intents.key === null) {
        this._toastr.warning('Vui lòng nhập thông tin', 'Lỗi!!');
      } else {
        this._toastr.error('Khoá đã tồn tại!', 'Lỗi!!');
      }
    });
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
