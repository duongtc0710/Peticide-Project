import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { API_URL } from 'src/app/config/url.constants';
import { Order, OrderItem } from 'src/app/models/order.model';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  private _api_url = API_URL;
  allOrderItem: any;
  allProductItem: any;
  allOrder: any;
  allOrder1: any;
  pagination: any;
  orderForm!: FormGroup;
  voucherForm!: FormGroup;
  orderValue: number = 0;
  orderItemValue: number = 0;
  closeResult: string = "";
  checkVnpay: boolean = false;
  checkPaymentCOD: string = "";
  paymentDetails = {};
  bankCode: string="";
  totalPayment: number = 0;
  valueOptionVnPay: string = '';
  singleOrder!: Order;
  getCartDetails: any = [];
  getUserDetails: any = [];
  userAddress: any;
  //check voucher
  checkInvalid: string = "";
  checkApplied: string = "";
  checkExpired: string = "";
  checkExpires: string = "";

  /**
    * constructor
    */
  constructor(public _orderService: OrderService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _toastr: ToastrService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal
  ) { }

  /**
    * ngOnInit
    */
  ngOnInit(): void {
    this.orderForm = this._formBuilder.group({
      address: ['', Validators.required]
    });  
    this.voucherForm = this._formBuilder.group({
      id_order: [''],
      code: [null, Validators.required]
    });  
    this.loadAllOrderItem(this._route.snapshot.params['id']);
    this.loadAllOrder();
    this.userDetails();
  }

  /**
    * function to goet all order 
    */
  loadAllOrder(){
    this._orderService.refreshListOrder().subscribe((response)=>{
      this.pagination = response.pagination;
      this.allOrder = response.data;
      for(let i = 0; i < this.allOrder.length; i++){
        this.singleOrder =  this.allOrder[i];
        this.orderValue = this.allOrder[i].id_order;
      }
    });
  }

  /**
    * function to get all order item
    */
  loadAllOrderItem(id: number){
    this._orderService.refreshListOrderItem(id).subscribe((response)=>{
      this.allOrder1 = response.order;
      this.allOrderItem = response.order_item;
      this.allProductItem = response.product_item;
      this.orderItemValue = this.allOrder1["id_order"];
      this.totalPayment = this.allOrder1["total_payment"];
    });
  }

  /**
    * function to get all user in localStorage
    */
  userDetails(){
    if(localStorage.getItem('user.id_acc')){
      this.getUserDetails = JSON.parse(localStorage.getItem('user.id_acc')!);
      this.userAddress = this.getUserDetails["address"];
      this.orderForm.setValue({
        address: this.userAddress
      });
    }
  }

  /**
    * function to open dialog 
    */
  openDialogDelete(content, orderID){
    this._modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
      this.closeResult = `Closed with: ${result}`;  
      if (result === 'yes') {  
        this.deleteOrder(orderID);
      }  
    }, (reason) => {  
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;  
    });  
  }

  /**
    * function to delete order
    */
  deleteOrder(id: number){
    this._orderService.deleteOrder(id).subscribe(()=>{
      this._toastr.success('Bạn đã hủy đơn hàng', 'Thành công');
      this.loadAllOrder();
      this._router.navigate(['/cart']);
    });
  }

  /**
    * function of button update order
    */
  onBtnUpdateOrder(){
    if(this.orderForm.get('address')?.value === ''){
      //If address null
      this._toastr.warning('Vui lòng nhập địa chỉ giao hàng', 'Thất bại'); 
    } else if(!this.valueOptionVnPay){
      //If chooser method payment
      this._toastr.warning('Vui lòng chọn phương thức thanh toán', 'Thất bại'); 
    } else {
      this.allOrder1["address"] = this.orderForm.get('address')?.value;
      this._orderService.updateOrder(this.allOrder1).subscribe((response)=>{
          this.getPayment();
      });
    }
  }

  /**
    * function to get payment
    */
  getPayment(){
    if (this.checkVnpay){
      this.paymentDetails = {
        "order_type": "billpayment",
        "order_id": this.orderValue,
        "amount": this.totalPayment,
        "order_desc": "",
        "bank_code": this.bankCode,
        "language": "vn",
        "ipaddr": 0
      }
      //Get payment link api
      this._orderService.getPaymentLink(this.paymentDetails).subscribe((response)=>{
        window.location.href = response;
      });
      //reset localStorage
      localStorage.removeItem('localCart');
      localStorage.setItem('localCart', JSON.stringify(this.getCartDetails));
    } else {
      this.orderValue = this.orderItemValue;
      //If payment method is COD, then set status = 3 and id_paymentmethod = 2
      //set status
      //set id_payment
      this.allOrder1["status"] = 3;
      this.allOrder1["id_paymentmethod"] = 2;
      this._orderService.updateOrder(this.allOrder1).subscribe((response): void=>{
        this.checkPaymentCOD = response as any;
        //Value response return
        //If "ok" then redirect to order-successful page
        if(this.checkPaymentCOD === "ok"){
            localStorage.removeItem('localCart');
            localStorage.setItem('localCart', JSON.stringify(this.getCartDetails));
            this._router.navigate(['/order-successful']);
        }
      });
    }
  }

  /**
    * function to get all cart item in localStorage
    */
  cartDetails(){
    if(localStorage.getItem('localCart')){
      this.getCartDetails = JSON.parse(localStorage.getItem('localCart')!);
    }
  }

  /**
    * function to display url image
    */
  createImgPath(serverPath: string) 
  {  
    return `${this._api_url}${serverPath}`;  
  } 

  /**
    * function to get dismiss reason
    */
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
    * function to check choose option value payment
    */
  onCheckOptionPayment(event: any){
    this.valueOptionVnPay = event.target.value;
    if(this.valueOptionVnPay === '1'){
      this.checkVnpay = true;
    } else {
      this.checkVnpay = false;
    }
  }

  /**
    * function to create voucher
    */
  createVoucher(){
    let voucher = this.voucherForm.value;
    voucher.id_order = this.orderValue;
    this._orderService.addVoucher(voucher).subscribe((response)=>{
      this.checkInvalid = response as string;
      this.checkApplied = response as string;
      this.checkExpired = response as string;
      this.checkExpires = response as string;
      if(this.checkInvalid === "invalid code"){//check invalid code
        this._toastr.warning('Mã bạn nhập không đúng!'); 
        this.voucherForm.reset();
      } else if(this.checkApplied === "Voucher applied!!"){//check applied code
        this._toastr.warning('Mã của bạn đã được sử dụng'); 
        this.voucherForm.reset();
      } else if(this.checkExpired === "Expired voucher code"){//check expired voucher code
        this._toastr.warning('Mã của bạn đã hết thời gian sử dụng'); 
        this.voucherForm.reset();
      } else if(this.checkExpires === "Voucher expires"){//check voucher expires
        this._toastr.warning('Mã của bạn đã hết thời gian sử dụng'); 
        this.voucherForm.reset();
      } else {
        this.loadAllOrderItem(this._route.snapshot.params['id']);
        this.voucherForm.reset();
      }
    })
  }

  /**
    * function to get value VnPay
    */
  onGetValueVnPay(event: any){
    this.bankCode = event.target.value;
  }
}
