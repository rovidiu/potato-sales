import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Product } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  constructor(
    private router: Router,
    private http: HttpClient
  ) {

  }

  /**
   * POST a new product to the server
   * @param {Product} product
   * @returns {Observable<Product>}
   */
  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${environment.productsUrl}`, product)
      .pipe(map((data) => {
        return data;
      }));
  }

  /**
   * GET products list from the server
   * @returns {Observable<Product[]>}
   */
  getProducts() {
    return this.http.get<any>(`${environment.productsUrl}`);
  }

  update(product) {
    return this.http.put<any>(`${environment.productsUrl}`, product)
      .pipe(map((data) => {
        return data;
      }));
  }
}


