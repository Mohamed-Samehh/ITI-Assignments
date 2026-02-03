import { Injectable } from '@angular/core';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Wireless Earbuds, IPX8',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
      images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400'],
      stock: 15,
      rating: 4,
      description: 'Organic Cotton, fairtrade certified',
      category: 'Audio',
      brand: 'TechBrand',
    },
    {
      id: 2,
      name: 'AirPods Max',
      price: 559.99,
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
      images: ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400'],
      stock: 0,
      rating: 5,
      description: 'A perfect balance of high-fidelity audio',
      category: 'Audio',
      brand: 'Apple',
    },
    {
      id: 3,
      name: 'Bose BT Earphones',
      price: 289.99,
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400',
      images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400'],
      stock: 0,
      rating: 4,
      description: 'Tune into all positions, vibrant, colors/black',
      category: 'Audio',
      brand: 'Bose',
    },
    {
      id: 4,
      name: 'VIVEFOX Headphones',
      price: 139.99,
      image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400',
      images: ['https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400'],
      stock: 25,
      rating: 5,
      description: 'Wired Stereo Headphones With Mic',
      category: 'Audio',
      brand: 'VIVEFOX',
    },
  ];

  constructor() {}

  getProducts(): Product[] {
    return this.products;
  }

  getProductById(id: number): Product | undefined {
    return this.products.find((product) => product.id === id);
  }
}
