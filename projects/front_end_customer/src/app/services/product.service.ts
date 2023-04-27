import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product, ProductPagination } from '../models/product.model';
import { API_URL } from 'src/app/config/url.constants';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, mergeMap, switchMap, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private _api_url = API_URL;
  private _products = new BehaviorSubject<Product[]>([]);
  private _pagination = new BehaviorSubject<ProductPagination | null>(null);
  public _search = new BehaviorSubject<string>("");

  constructor(private _httpClient: HttpClient) {}

  /**
    * Get products
    */
  refreshListProduct(page: number = 1): Observable<{pagination: ProductPagination, data: Product[]}> {
    return this._httpClient.get<{pagination: ProductPagination, data: Product[]}>(`${this._api_url}/api/pro/product`,{
      params: {
        page: '' + page
      }
    }).pipe(
      tap((response): void => {
        this._pagination.next(response.pagination);
        this._products.next(response.data);
      })
    );
  }

  /**
    * Search products with given query
    *
    * @param query
    */
  searchProducts(query: string): Observable<{pagination: ProductPagination, data: Product[]}>
   {
    return this._httpClient.get<{pagination: ProductPagination, data: Product[]}>(`${this._api_url}/api/pro/filter/`, {
      params: {
        search: query
      }
    }).pipe(
      tap((response): void => {
        this._pagination.next(response.pagination);
        this._products.next(response.data)
      })
    );
  }

  /**
    * Get product by id
    */
  getProductById(id: number): Observable<Product>{
    return this._httpClient.get<Product>(`${this._api_url}/api/pro/getbyid/${id}`);
  }

  /**
     * Add to order
     */
  filterByCategory(data): Observable<any>
  {
    return this._httpClient.post<any>(`${this._api_url}/api/pro/getByFilter/`, data);
  }
}
