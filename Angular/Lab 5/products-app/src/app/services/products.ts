import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../models/product.interface';

interface ProductsResponse {
  products: DummyJsonProduct[];
}

interface DummyJsonProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  brand: string;
  thumbnail: string;
  images: string[];
  rating: number;
  stock: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly baseUrl = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http
      .get<ProductsResponse>(this.baseUrl)
      .pipe(map((response) => response.products.map((item) => this.mapProduct(item))));
  }

  getProductById(id: number): Observable<Product> {
    return this.http
      .get<DummyJsonProduct>(`${this.baseUrl}/${id}`)
      .pipe(map((item) => this.mapProduct(item)));
  }

  private mapProduct(product: DummyJsonProduct): Product {
    return {
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.thumbnail,
      images: product.images,
      stock: product.stock,
      rating: Math.round(product.rating),
      description: product.description,
      category: product.category,
      brand: product.brand,
    };
  }
}
