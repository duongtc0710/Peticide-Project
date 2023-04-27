import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { API_URL } from "src/app/config/url.constants";
import { CartItem } from "src/app/models/cart.model";

@Injectable({
    providedIn: 'root'
})

export class CartService {

    private _api_url = API_URL;

    constructor(private _httpClient: HttpClient) {}

    /**
    * Get cart item
    */
    refreshListCartItem(id: number): Observable<any> {
        
        var headers = new HttpHeaders()
        .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
    
        var options =  {
            headers: headers
        };
    
        return this._httpClient.get<any>(`${this._api_url}/api/cart/proitem/${id}`, options).pipe(tap((response): void => {}));
    }

    /**
     * Add to cart
     */
    addToCart(cartItem: CartItem): Observable<CartItem>
    {
        var headers = new HttpHeaders()
        .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
    
        var options =  {
            headers: headers
        };
    
        return this._httpClient.post<CartItem>(`${this._api_url}/api/cart/cart`, cartItem, options);
    }

    /**
     * Update cart item
     */
    updateToCart(cartItem)
    {
        var headers = new HttpHeaders()
        .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
    
        var options =  {
            headers: headers
        };
    
        return this._httpClient.put<any>(`${this._api_url}/api/cart/cart`, cartItem, options);
    }

    /**
     * Delete the product
     *
     * @param id    
     */
    deleteCart(id: number): Observable<number> {

        var headers = new HttpHeaders()
        .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
    
        var options =  {
            headers: headers
        };
    
        return this._httpClient.delete<number>(`${`${this._api_url}/api/cart/cart`}/${id}`, options);
    }
}