import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Order } from 'src/app/models/order.model';

@Component({
  selector: 'order-successful',
  templateUrl: './order-successful.component.html',
  styleUrls: ['./order-successful.component.css']
})
export class OrderSuccessfulComponent implements OnInit {
  

  allOrder: any;
  allOrder1: any;
  allOrderItem: any;
  allProductItem: any;
  pagination: any;
  singleOrder!: Order;
  id_order: number = 0;
  trans_date = '';
  query = {};
  orderValue: number = 0;


  /**
    * contructor
    */
  constructor(
    public _orderService: OrderService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  /**
    * ngOnInit
    */
  ngOnInit(): void {

    this._route.queryParams
      .subscribe(params => {
        this.trans_date = params.vnp_PayDate;
        this.id_order = params.vnp_TxnRef;
      }
    );
    this.queryPayment();
    this.loadAllOrderItem(this.id_order);
    this.loadAllOrder();
  }

  /**
    * function to get all order 
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
    });
  }

  /**
    * function to query payment
    */
  queryPayment(): void{

    this.query = {
      "id_order":  this.id_order,
      "trans_date": this.trans_date 
    };

    //query payment
    this._orderService.queryPayment(this.query).subscribe((response): void=>{
      // check status success
      // vnp_ResponseCode = 0
      // then set status = 1
      // id_paymentmethod = 1
      if(response['vnp_ResponseCode'] === '00'){
        this.allOrder1["status"] = 1;
        this.allOrder1["id_paymentmethod"] = 1;
        this._orderService.updateOrder(this.allOrder1).subscribe((): void=>{});
        this._router.navigate(['/purchase/', this.id_order])
      } 
      // check status lost
      // then set status = 2
      // id_paymentmethod = 2
      else {
        this.orderValue = this.id_order;
        this.allOrder1["status"] = 2;
        this.allOrder1["id_paymentmethod"] = 0;
        this._orderService.updateOrder(this.allOrder1).subscribe((): void=>{});
      }
    })
  }
}
