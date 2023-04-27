import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CateOfPro, ImageOfProduct, Product, ProductPagination } from '../models/product.model';
import { API_URL } from 'src/app/config/url.constants';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FileView } from '../models/account.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  // Private
  private _api_url = API_URL;
  private _products = new BehaviorSubject<Product[]>([]);
  private _pagination = new BehaviorSubject<ProductPagination | null>(null);
  list: CateOfPro[] = [];
  
  constructor(private _httpClient: HttpClient) { }

  /**
     * Get products
     */
  refreshListProduct(page: number = 1): Observable<{pagination: ProductPagination, data: Product[]}> 
  {
    return this._httpClient.get<{pagination: ProductPagination, data: Product[]}>(`${this._api_url}/api/pro/product-admin`,{
      params: {
        page: '' + page
      },
      headers: new HttpHeaders({Authorization: 'Token ' + localStorage.getItem('access_token')})
    }).pipe(
      tap((response): void => {
        this._pagination.next(response.pagination);
        this._products.next(response.data);
        })
    );
  }

  refreshListProductByAgency(page: number = 1, idAgency): Observable<{pagination: ProductPagination, data: Product[]}>
  {
    return this._httpClient.get<{pagination: ProductPagination, data: Product[]}>(`${this._api_url + "/api/pro/product-agency"}/${idAgency}`, {
      params: {
        page: '' + page
      },
      headers: new HttpHeaders({Authorization: 'Token ' + localStorage.getItem('access_token')})
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
          },
          headers: new HttpHeaders({Authorization: 'Token ' + localStorage.getItem('access_token')})
      }).pipe(
           tap((response) => {
               this._pagination.next(response.pagination);
               this._products.next(response.data)
      })
    );
  }

  /**
     * Create product
     */
  createProduct(product: Product): Observable<Product> 
  {
    var headers = new HttpHeaders()
            .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
        
        var options =  {
            headers: headers
        };
      return this._httpClient.post<Product>(`${this._api_url}/api/pro/product`, product, options);
  }

  /**
   * Delete the product
   *
   * @param id    
   */
  deleteProduct(id: number): Observable<number> {
    var headers = new HttpHeaders()
            .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
        
        var options =  {
            headers: headers
        };
    return this._httpClient.delete<number>(`${`${this._api_url}/api/pro/product`}/${id}`, options);
  }

  /**
   * Update product
   */
  updateProduct(product: Product): Observable<Product> 
  {
    var headers = new HttpHeaders()
            .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
        
        var options =  {
            headers: headers
        };
      return this._httpClient.put<Product>(`${this._api_url}/api/pro/product`, product, options);
  }
  
  uploadFile(fileToUpload: File)
  {      
    const formData: FormData = new FormData();
    
    formData.append('file', fileToUpload);

    var headers = new HttpHeaders()
            .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
        
        var options =  {
            headers: headers
        };
    return this._httpClient.post<FileView>(`${this._api_url}/upload`, formData, options)
  }

  /**
   * Get files of pro by id
   */
  getFilesOfProductById(id: number): Observable<ImageOfProduct> 
  {
    var headers = new HttpHeaders()
            .set('Authorization', 'Token ' + localStorage.getItem('access_token'));
        
        var options =  {
            headers: headers
        };
      return this._httpClient.get<ImageOfProduct>(`${`${this._api_url}/imagepro`}/${id}`, options)
  }
}
