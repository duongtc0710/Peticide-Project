import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { API_URL } from 'src/app/config/url.constants';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [],
})
export class NavbarComponent implements OnInit {


  public _api_url = API_URL;
  getUserData: any = [];
  getSubData: any = [];

  constructor(private _router: Router) {}

  ngOnInit(): void {
    this.userData();
  }

  /**
   * Get user data in local
   */
  userData() {
    if (localStorage.getItem('userData')) {
      this.getUserData = JSON.parse(localStorage.getItem('userData')!);
    }

    if (localStorage.getItem('subdata')) {
      this.getSubData = JSON.parse(localStorage.getItem('subdata')!);
    }
  }

  /**
   * Get url image
   */
  createImgPath(serverPath: string) {
    return `${this._api_url}${serverPath}`;
  }

  /**
    * Logout
    */
  logout(){
    localStorage.removeItem('userData');
    localStorage.removeItem('subdata');
    localStorage.removeItem('access_token');
    this._router.navigate(['/login']);
  }
}
