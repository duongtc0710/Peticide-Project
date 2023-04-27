import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { API_URL } from 'src/app/config/url.constants';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-orders-detail',
  templateUrl: './orders-detail.component.html',
  styleUrls: [ './orders-detail.component.css'
  ]
})
export class OrdersDetailComponent implements OnInit {

  closeResult = "";
  orders: any;
  ordersItem: any
  products_item: any
  allOrderItem: any;
  totalItem: number = 0;
  private _api_url = API_URL;

  /**
    * constructor
    */
  constructor(
    public _orderService: OrderService,
    private _toastr: ToastrService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _modalService: NgbModal
  ) { }

  /**
    * ngOnInit
    */  
  ngOnInit(): void {
    this.getRoute(this._route.snapshot.params['id']);
  }

  /**
    * function to get route by id
    */  
  getRoute(id: number){
    // Get order by id with api
    this._orderService.getOrderById(id)
    .subscribe((response) => {
      console.log(response)
      this.orders = response.order;
      this.ordersItem = response.order_item;
      this.products_item = response.product_item;
    });
  }

  /**
    * function to delete orders
    */  
  updateStatus(id: number){
    this.orders["status"] = 2;
    this._orderService.updateOrder(this.orders).subscribe((response)=>{
      this._toastr.success('Bạn đã hủy thành công đơn hàng');
      this._router.navigate(['/orders-list']);
    })
  }

  /**
    * function to display url image
    */
  createImgPath(serverPath: string) 
  {  
    return `${this._api_url}${serverPath}`;  
  } 

  /**
    * function to open dialog 
    */
  openDialogDelete(content, orderID){
    this._modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
      this.closeResult = `Closed with: ${result}`;  
      if (result === 'yes') {  
        this.updateStatus(orderID);
      }  
    }, (reason) => {  
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;  
    });  
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
}
