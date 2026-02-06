import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class CartComponent {
  readonly items$;
  readonly count$;

  constructor(private cartService: CartService) {
    this.items$ = this.cartService.items$;
    this.count$ = this.cartService.count$;
  }

  increase(productId: number): void {
    this.cartService.increaseQuantity(productId);
  }

  decrease(productId: number): void {
    this.cartService.decreaseQuantity(productId);
  }

  remove(productId: number): void {
    this.cartService.removeItem(productId);
  }
}
