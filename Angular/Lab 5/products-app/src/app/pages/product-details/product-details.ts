import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ProductsService } from '../../services/products';
import { Product } from '../../models/product.interface';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productsService
      .getProductById(id)
      .pipe(
        catchError(() => {
          this.router.navigate(['/404']);
          return of(null);
        }),
      )
      .subscribe((product) => {
        if (!product) {
          return;
        }
        this.product = product;
      });
  }

  getStarArray(): boolean[] {
    return Array(5)
      .fill(false)
      .map((_, i) => i < (this.product?.rating || 0));
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product) {
      return;
    }
    this.cartService.addItem(this.product, this.quantity);
    this.router.navigate(['/cart']);
  }
}
