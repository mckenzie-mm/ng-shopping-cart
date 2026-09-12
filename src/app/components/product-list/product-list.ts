// src/app/components/product-list/product-list.component.ts

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/cart.model';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule],
  styleUrl: './product-list.css',
  templateUrl: './product-list.html',
})
export class ProductListComponent {
  cart = inject(CartService);

  products: Product[] = [
    { id: 1, name: 'Premium Wireless Headphones', price: 99.99 },
    { id: 2, name: 'Mechanical Gaming Keyboard', price: 129.50 },
    { id: 3, name: 'Ergonomic Vertical Mouse', price: 45.00 }
  ];
}