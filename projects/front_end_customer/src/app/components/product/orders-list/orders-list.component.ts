import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { API_URL } from 'src/app/config/url.constants';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: [ 'orders-list.component.css'
  ]
})
export class OrdersListComponent implements OnInit {

  getUserDetails: any = [];
  allOrders$: any;
  pagination: any;
  page: number = 1;
  idUser: number = 0;

  /**
    * constructor
    */
  constructor(
    public _orderService: OrderService
  ) { }

  /**
    * ngOnInit
    */
  ngOnInit(): void {
    this.userDetails();
    this.loadOrders();
  }

  /**
    * function to get all user in localStorage
    */
  userDetails(){
    if(localStorage.getItem('user.id_acc')){
      this.getUserDetails = JSON.parse(localStorage.getItem('user.id_acc')!);
      this.idUser = this.getUserDetails["id_acc"];
    }
  }

  /**
    * function to get all orders
    */  
  loadOrders() {
    this._orderService.refreshListOrders(this.idUser).subscribe((response)=>{
      this.allOrders$ = response;
    });
  }
}
