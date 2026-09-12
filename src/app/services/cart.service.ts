// src/app/services/cart.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { Product, CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // State: holds the array of cart items
  private cartItemsSignal = signal<CartItem[]>([]);

  // Publicly exposed readonly signals for selectors
  readonly cartItems = this.cartItemsSignal.asReadonly();

  // Automatically derived counts
  readonly totalItems = computed(() => 
    this.cartItemsSignal().reduce((acc, item) => acc + item.quantity, 0)
  );

  readonly totalPrice = computed(() => 
    this.cartItemsSignal().reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
  );

  // Action: Add product to cart
  addToCart(product: Product): void {
    this.cartItemsSignal.update(items => {
      const existingItem = items.find(item => item.product.id === product.id);
      if (existingItem) {
        return items.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...items, { product, quantity: 1 }];
    });
  }

  // Action: Remove or decrease product quantity
  removeFromCart(productId: number): void {
    this.cartItemsSignal.update(items => 
      items.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      ).filter(item => item.quantity > 0)
    );
  }

  // Action: Clear entire cart
  clearCart(): void {
    this.cartItemsSignal.set([]);
  }
}