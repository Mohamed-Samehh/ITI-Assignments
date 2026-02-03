import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.interface';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCardComponent {
  @Input() product!: Product;

  getStockStatus(): { text: string; class: string } {
    if (this.product.stock === 0) {
      return { text: 'Out of stock', class: 'out-of-stock' };
    }
    return { text: 'In stock', class: 'in-stock' };
  }

  getStarArray(): boolean[] {
    return Array(5)
      .fill(false)
      .map((_, i) => i < this.product.rating);
  }
}
