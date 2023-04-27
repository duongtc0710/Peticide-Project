import { Component, OnInit } from '@angular/core';
import { API_URL } from 'src/app/config/url.constants';
import { ChatService } from 'src/app/services/chat/chat.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  private _api_url = API_URL;
  allProducts$: any;
  quantity: number = 1;
  data = [];
  slides = [
    { 
      img: "http://tanthanhco.com.vn/img/img/3a142aaf339ecec0978f.jpg"
    },
    { 
      img: "http://tanthanhco.com.vn/img/img/720949bd508cadd2f49d.jpg"
    },
    {
      img: "http://tanthanhco.com.vn/img/img/ba1ec290dba126ff7fb0.jpg"
    },
    { 
      img: "http://tanthanhco.com.vn/img/img/d69722253b14c64a9f05.jpg"
    },
    { 
      img: "http://tanthanhco.com.vn/img/img/319957c788f175af2ce0.jpg"
    }
  ];

  slideConfig2 = {
    "speed": 200,
    "slidesToShow": 3, 
    "slidesToScroll": 3,
    "dots": true,
    "autoplay": true,
    "centerMode": true
  };

  /**
    * constructor
    */
  constructor(public _productService: ProductService) { }

  /**
    * ngOnInit
    */
  ngOnInit(): void 
  {
    //get list product with api
    this._productService.refreshListProduct().subscribe((response)=>{
      this.allProducts$ = response.data;
    });    
  }

  /**
    * Display url image
    */
  createImgPath(serverPath: string) 
  {  
    return `${this._api_url}${serverPath}`;  
  }
}
