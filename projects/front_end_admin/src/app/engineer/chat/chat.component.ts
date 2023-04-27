import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ChatService } from 'src/app/services/engineer/chat.service';
import { Subscription, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { API_URL } from 'src/app/config/url.constants';
declare const reloadElement: any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  @ViewChild('activeFrameinputFile') private InputFrameVariable!: ElementRef;
  imageInput!: ElementRef;
  scrollMe!: ElementRef;
  getChat: any = [];
  getChatHandler: any = [];
  getMessbyID: any = [];
  getUserDataS = [];
  getSubData = [];
  _data = {};
  checkStatus: string = '';
  chatDetail = {};
  roomChat = 0;
  getUserDetails: any = [];
  chatForm!: FormGroup;
  fileToUpload: File | any = null;
  messageDetail: any;
  public timersubscription: Subscription = new Subscription();
  id_acc = 0;
  public _api_url = API_URL;
  windowScrolled: boolean = false;

  // mess: any;
  // room: any;

  constructor(
    private _chatService: ChatService,
    private _formBuilder: FormBuilder
  ) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop > 100
    ) {
      this.windowScrolled = true;
    } else if (
      (this.windowScrolled && window.pageYOffset) ||
      document.documentElement.scrollTop ||
      document.body.scrollTop < 10
    ) {
      this.windowScrolled = false;
    }
  }

  ngOnInit(): void {
    this.userData();
    this._chatService.getRoomList().subscribe((res) => {
      this.getChat = res;
    });

    this._chatService
      .getRoomHandlerList(this.getUserDataS['id_acc'])
      .subscribe((res) => {
        this.getChatHandler = res;
      });

    // timer(0, 10000) call the function immediately and every 10 seconds
    this.timersubscription = timer(0, 1000)
      .pipe(
        map(() => {
          this.getRoomList(); // load data contains the http request
          this.getRoomHandlerList(); // load data contains the http request
          this.getDetailChat();
          this.getMessage(this.roomChat);
        })
      )
      .subscribe();

    this.chatForm = this._formBuilder.group({
      message: ['', [Validators.required]],
    });
  }

  scrollToBottom(): void {
    try {
      this.scrollMe.nativeElement.scrollTop =
        this.scrollMe.nativeElement.scrollHeight;
    } catch (err) {}
  }

  /**
   * Scroll to top
   */
  scrollToTop() {
    (function smoothscroll() {
      var currentScroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - currentScroll / 8);
      }
    })();
  }

  getRoomList() {
    this._chatService.getRoomList().subscribe((res) => {
      this.getChat = res;
    });
  }

  getRoomHandlerList() {
    this._chatService
      .getRoomHandlerList(this.getUserDataS['id_acc'])
      .subscribe((res) => {
        this.getChatHandler = res;
      });
  }

  handlerMess(data) {
    this._data = {
      id_room: data.id_room,
      id_acc_handler: this.getUserDataS['id_acc'],
      timestamp: data.timestamp,
    };

    this._chatService.putRoom(this._data).subscribe((res) => {});

    document.getElementById('tabpane-2')?.click();

    reloadElement();
  }

  getMessage(data) {
    this.roomChat = data;
    this._chatService.getMessage(data).subscribe((res) => {
      this.getMessbyID = res;
    });
  }

  userChat() {
    this.chatDetail = {
      id_message: 0,
      id_room: this.roomChat,
      id_acc: this.getUserDataS['id_acc'],
      message: this.chatForm.get('message')?.value,
      image: this.fileToUpload,
      timestamp: '2022-04-09T16:54:16.294885Z',
      is_read: false,
    };
    const formData: FormData = new FormData();
    formData.append('id_message', '0');
    formData.append('id_room', this.roomChat.toString());
    formData.append('id_acc', this.getUserDataS['id_acc']);
    formData.append('message', this.chatForm.get('message')?.value);
    formData.append('timestamp', '2022-04-09T16:54:16.294885Z');
    formData.append('is_read', 'false');

    if (this.fileToUpload != null) {
      formData.append('image', this.fileToUpload);
    }

    this._chatService.createChat(formData).subscribe((response) => {
      this.getDetailChat();
      this.resetForm();
    });
    this.scrollToBottom();
  }

  getDetailChat() {
    if (this.roomChat > 0) {
      this._chatService.getMessage(this.roomChat).subscribe((response) => {
        this.messageDetail = response;
      });
    }
  }

  /**
   * Upload avatar
   *
   */
  selectedFile(imageInput: any): void {
    const file: File = imageInput.files[0];

    this.fileToUpload = file;
  }

  userData() {
    if (localStorage.getItem('userData')) {
      this.getUserDataS = JSON.parse(localStorage.getItem('userData')!);
      this.id_acc = this.getUserDataS['id_acc'];
    }

    if (localStorage.getItem('subdata')) {
      this.getSubData = JSON.parse(localStorage.getItem('subdata')!);
    }
  }

  resetForm() {
    this.scrollToBottom();
    this.chatForm.reset();
    this.chatForm = this._formBuilder.group({
      message: ['', [Validators.required]],
    });
    this.InputFrameVariable.nativeElement.value = '';
    this.fileToUpload = null;
  }

  /**
   * Get url image
   */
  createImgPath(serverPath: string) {
    return `${this._api_url}${serverPath}`;
  }

  handleClick() {
    document.getElementById('fileInput')?.click();
  }

  /**
    * key down
    */
   keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.userChat()
    }
  }
}
