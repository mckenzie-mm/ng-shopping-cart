// src/app/app.component.ts
import { Component } from '@angular/core';
import { ProductListComponent } from './components/product-list/product-list';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart';

@Component({
  selector: 'app-root',
  imports: [ProductListComponent, ShoppingCartComponent],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}