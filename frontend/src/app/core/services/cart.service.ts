import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../data/mock-data';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _items = signal<CartItem[]>([]);
  private readonly _favorites = signal<number[]>([]);

  readonly items = this._items.asReadonly();
  readonly favorites = this._favorites.asReadonly();

  readonly count = computed(() =>
    this._items().reduce((sum, i) => sum + i.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this._items().reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  );

  readonly deliveryFee = computed(() => (this._items().length > 0 ? 1.99 : 0));

  readonly total = computed(() => this.subtotal() + this.deliveryFee());

  add(product: Product, quantity = 1) {
    const items = [...this._items()];
    const idx = items.findIndex((i) => i.product.id === product.id);
    if (idx >= 0) {
      items[idx] = { ...items[idx], quantity: items[idx].quantity + quantity };
    } else {
      items.push({ product, quantity });
    }
    this._items.set(items);
  }

  remove(productId: number) {
    this._items.set(this._items().filter((i) => i.product.id !== productId));
  }

  increment(productId: number) {
    this._items.set(
      this._items().map((i) =>
        i.product.id === productId ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  }

  decrement(productId: number) {
    const items = this._items()
      .map((i) =>
        i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i
      )
      .filter((i) => i.quantity > 0);
    this._items.set(items);
  }

  clear() {
    this._items.set([]);
  }

  toggleFavorite(productId: number) {
    const favs = this._favorites();
    if (favs.includes(productId)) {
      this._favorites.set(favs.filter((id) => id !== productId));
    } else {
      this._favorites.set([...favs, productId]);
    }
  }

  isFavorite(productId: number): boolean {
    return this._favorites().includes(productId);
  }
}
