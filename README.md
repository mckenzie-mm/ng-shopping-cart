# ng-shopping-cart

Here is a modern, clean, and reactive shopping cart example in Angular utilizing Angular Signals (available in Angular 16+). This architecture leverages a single global service to hold the cart state and standalone components to display the catalog and cart seamlessly.

### 1. Define the Data Models
Create an interface for the items available in your shop and the items managed inside the cart.
```ts
typescript

// product.model.ts
export interface Product {
  id: number;
  name: string;
  price: number;
}

// cart-item.model.ts
export interface CartItem {
  product: Product;
  quantity: number;
}
```

### 2. Create the Reactive Cart Service
This service uses a signal to manage the cart state dynamically. It uses a computed signal to automatically calculate the total cost and item count in real-time. 

```ts
typescript

// cart.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { Product, CartItem } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Main reactive state for the cart
  private cartItemsSignal = signal<CartItem[]>([]);

  // Expose readonly signal for components to read
  cartItems = this.cartItemsSignal.asReadonly();

  // Computed state: automatically recalculates when cartItemsSignal changes
  totalItems = computed(() => 
    this.cartItemsSignal().reduce((acc, item) => acc + item.quantity, 0)
  );

  totalPrice = computed(() => 
    this.cartItemsSignal().reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
  );

  addToCart(product: Product) {
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

  removeFromCart(productId: number) {
    this.cartItemsSignal.update(items => 
      items.filter(item => item.product.id !== productId)
    );
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.cartItemsSignal.update(items =>
      items.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }
}
```

### 3. Create the Product List Component
This standalone component simulates a small catalogue where users can push items into the CartService. 

```ts
typescript

// product-list.component.ts
import { Component, inject } from '@angular/core';
import { CartService } from './cart.service';
import { Product } from './product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  template: `
    <div class="product-grid">
      @for (product of products; track product.id) {
        <div class="product-card">
          <h3>{{ product.name }}</h3>
          <p>\${{ product.price }}</p>
          <button (click)="addToCart(product)">Add to Cart</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .product-grid { display: flex; gap: 16px; margin-bottom: 24px; }
    .product-card { border: 1px solid #ccc; padding: 16px; border-radius: 8px; }
  `]
})
export class ProductListComponent {
  private cartService = inject(CartService);

  products: Product[] = [
    { id: 1, name: 'Wireless Headphones', price: 99 },
    { id: 2, name: 'Mechanical Keyboard', price: 120 },
    { id: 3, name: 'Gaming Mouse', price: 60 }
  ];

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }
}
```

### 4. Create the Shopping Cart View Component
This component reads values directly from the CartService using Signals. Angular updates the DOM automatically whenever items, quantities, or computed totals shift. 

```ts
typescript

// shopping-cart.component.ts
import { Component, inject } from '@angular/core';
import { CartService } from './cart.service';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  template: `
    <div class="cart-container">
      <h2>Your Cart ({{ cartService.totalItems() }} items)</h2>
      
      @if (cartService.cartItems().length === 0) {
        <p>Your cart is empty.</p>
      } @else {
        <ul>
          @for (item of cartService.cartItems(); track item.product.id) {
            <li>
              <span>{{ item.product.name }} - \${{ item.product.price }}</span>
              <div class="qty-controls">
                <button (click)="decreaseQty(item.product.id, item.quantity)">-</button>
                <span>{{ item.quantity }}</span>
                <button (click)="increaseQty(item.product.id, item.quantity)">+</button>
                <button (click)="remove(item.product.id)" class="remove-btn">Remove</button>
              </div>
            </li>
          }
        </ul>
        <hr />
        <h3>Total Bill: \${{ cartService.totalPrice() }}</h3>
      }
    </div>
  `,
  styles: [`
    .cart-container { border: 2px solid #333; padding: 20px; border-radius: 8px; max-width: 400px; }
    ul { list-style: none; padding: 0; }
    li { display: flex; justify-content: space-between; margin-bottom: 12px; align-items: center; }
    .qty-controls { display: flex; gap: 8px; align-items: center; }
    .remove-btn { background-color: #ff4d4d; color: white; border: none; padding: 2px 8px; cursor: pointer; }
  `]
})
export class ShoppingCartComponent {
  // Inject service globally accessible to template expressions
  protected cartService = inject(CartService);

  increaseQty(productId: number, currentQty: number) {
    this.cartService.updateQuantity(productId, currentQty + 1);
  }

  decreaseQty(productId: number, currentQty: number) {
    this.cartService.updateQuantity(productId, currentQty - 1);
  }

  remove(productId: number) {
    this.cartService.removeFromCart(productId);
  }
}
```

### 5. Combine Components in App Component

```ts
typescript

// app.component.ts
import { Component } from '@angular/core';
import { ProductListComponent } from './product-list.component';
import { ShoppingCartComponent } from './shopping-cart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProductListComponent, ShoppingCartComponent],
  template: `
    <main style="padding: 20px;">
      <h1>Angular Signals E-Commerce Store</h1>
      <app-product-list />
      <app-shopping-cart />
    </main>
  `
})
export class AppComponent {}
```

## References

 [1] (https://dev.to/leolanese/angular-17-signals-with-stand-alone-shopping-cart-3oon), 
 
 [2] (https://github.com/leolanese/Angular-Signals-StandAlone-Shopping-Cart)

