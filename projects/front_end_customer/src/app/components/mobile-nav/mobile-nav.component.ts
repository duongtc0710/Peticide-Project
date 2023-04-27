import { AfterViewChecked, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_URL } from 'src/app/config/url.constants';
import { ChatService } from 'src/app/services/chat/chat.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-mobile-nav',
  templateUrl: './mobile-nav.component.html',
  styleUrls: [ './mobile-nav.component.css'
  ]
})
export class MobileNavComponent implements OnInit{

  public timersubscription: Subscription = new Subscription();
  @ViewChild('activeFrameinputFile') private InputFrameVariable!: ElementRef;
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  private _api_url = API_URL;
  windowScrolled: boolean = false;
  fileToUpload: File | any = null;
  searchTerm: string = '';
  imageUrl: string = "";
  roomChat = 0;
  idCus = 0;
  idAcc = 0;
  getUserDetails: any = [];
  chatForm!: FormGroup;
  messageDetail: any;

  /**
    * Constructor
    */ 
  constructor(public _productService: ProductService,  private _toastr: ToastrService,
    private _router: Router,
    private _chatService: ChatService,
    private _formBuilder: FormBuilder) { }

  @HostListener("window:scroll", [])
  onWindowScroll() {
      if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
        this.windowScrolled = true;
      } 
     else if (this.windowScrolled && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10) {
        this.windowScrolled = false;
      }
  }

  /**
    * ngOnInit
    */
  ngOnInit(): void {
    this.userDetails();
    this.chatForm = this._formBuilder.group({
      message: ['', [Validators.required]]
    });
    this.getChattingRoom();
  }

  /**
    * function Search product
    */
  search(event: any): void {
    // Get value input 
    this.searchTerm = (event.target as HTMLInputElement).value;
    this._productService._search.next(this.searchTerm);
  }

  /**
    * Scroll to top
    */ 
  scrollToTop() {
    (function smoothscroll() {
      var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - (currentScroll / 8));
      }
    })();
  }

  /**
    * Scroll to bottom
    */ 
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
  }


  /**
    * function to get all user in localStorage
    */
  userDetails(){
    if(localStorage.getItem('user.id_acc')){
      this.getUserDetails = JSON.parse(localStorage.getItem('user.id_acc')!);
      this.idCus = this.getUserDetails["id_acc"];
      this.idAcc = this.getUserDetails["id_acc"];
    }
  }

  /**
    * function to open chat
    */
  openchat(event){
    this._chatService.createRoom(event.target.value).subscribe((response)=>{
      this.roomChat = response['id_room'];
    })
    document.getElementById('myForm')!.style.display = "block"
  }

  
  /**
    * function to get chatting room dispalay message
    */
  getChattingRoom(){
    // timer(0, 10000) call the function immediately and every 10 seconds 
    this.timersubscription = timer(0, 1000).pipe( 
      map(() => { 
        this.getDetailChat();
      }) 
    ).subscribe();
  }

  /**
    * function get detail chat
    */
  getDetailChat(){
    this._chatService.getChat(this.roomChat).subscribe((response)=>{
      this.messageDetail = response;
    })
  }

  /**
    * function to close form
    */
  closeForm() {
    document.getElementById("myForm")!.style.display = "none";
  }

  /**
    * function to choose file
    */
  selectedFile(imageInput: any): void
  {
    const file: File = imageInput.files[0];

    this.fileToUpload = file;

    var reader = new FileReader();

    reader.onload = (event: any) => {
      //Change image on load
      this.imageUrl = event.target.result;
    };

    //Read file
    reader.readAsDataURL(file);
  }

  /**
    * function to reset image
    */
  resetImage() {
    this.imageUrl = "";
    this.resetForm();
  }

  /**
    * function to user chat
    */
  userChat(){
    if(this.idAcc !== 0){
      if (!(this.chatForm.get('message')?.value === '' && this.fileToUpload === null))
      {
        if (this.roomChat === 0){
          this.sendMessage();
          this.imageUrl = "";
        } else {
          this.sendMessage();
          this.imageUrl = "";
        }
      }
    } else {
      this._toastr.warning('Vui lòng đăng nhập trước khi thực hiện chức năng này');
      this._router.navigate(['/sign-in']);
    }
  }

  /**
    * key down
    */
  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.userChat()
    }
  }

  /**
    * function to sent message with engeener
    */
  sendMessage()
  {
    const formData: FormData = new FormData();
    formData.append('id_message', "0");
    formData.append('id_room', this.roomChat.toString());
    formData.append('id_acc', this.getUserDetails["id_acc"]);
    formData.append('message', this.chatForm.get('message')?.value);   
    formData.append('timestamp', "2022-04-09T16:54:16.294885Z");
    formData.append('is_read', "false");
  

    if (this.fileToUpload != null){
      formData.append('image', this.fileToUpload);
    }
      
    this._chatService.createChat(formData).subscribe((response)=>{
      this.getDetailChat();
      this.resetForm();
    })

    this.scrollToBottom();   
  }

  /**
    * function to reset form
    */
  resetForm()
  {
    this.chatForm.reset();
    this.chatForm = this._formBuilder.group({
      message: ['', [Validators.required]],
    });
    this.InputFrameVariable.nativeElement.value = '';
    this.fileToUpload = null;
  }

  /**
    * function to get url image
    */
  handleClick() {
    document.getElementById('fileInput')!.click();
  }

   /**
    * Get url image
    */
  createImgPath(serverPath: string) 
  {  
    return `${this._api_url}${serverPath}`;  
  }
}
