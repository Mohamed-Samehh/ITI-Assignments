import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Product } from '../models/product.interface';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>([]);

  readonly items$: Observable<CartItem[]> = this.itemsSubject.asObservable();
  readonly count$: Observable<number> = this.items$.pipe(
    map((items) => items.reduce((total, item) => total + item.quantity, 0)),
  );

  addItem(product: Product, quantity: number): void {
    const items = this.itemsSubject.getValue();
    const existing = items.find((item) => item.product.id === product.id);

    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.stock);
      this.itemsSubject.next([...items]);
      return;
    }

    const safeQuantity = Math.min(quantity, product.stock);
    if (safeQuantity > 0) {
      this.itemsSubject.next([...items, { product, quantity: safeQuantity }]);
    }
  }

  increaseQuantity(productId: number): void {
    const items = this.itemsSubject.getValue();
    const existing = items.find((item) => item.product.id === productId);

    if (existing && existing.quantity < existing.product.stock) {
      existing.quantity += 1;
      this.itemsSubject.next([...items]);
    }
  }

  decreaseQuantity(productId: number): void {
    const items = this.itemsSubject.getValue();
    const existing = items.find((item) => item.product.id === productId);

    if (existing && existing.quantity > 1) {
      existing.quantity -= 1;
      this.itemsSubject.next([...items]);
    }
  }

  removeItem(productId: number): void {
    const items = this.itemsSubject.getValue();
    this.itemsSubject.next(items.filter((item) => item.product.id !== productId));
  }
}
