import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, serverTimestamp } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { CartItem, Product } from '../models';

const DELIVERY_FEE_INR = 25;

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly db = inject(Firestore);
  private readonly auth = inject(AuthService);

  private readonly _items = signal<CartItem[]>([]);
  private readonly _favorites = signal<string[]>([]);

  readonly items = this._items.asReadonly();
  readonly favorites = this._favorites.asReadonly();

  readonly count = computed(() => this._items().reduce((s, i) => s + i.quantity, 0));
  readonly subtotal = computed(() =>
    this._items().reduce((s, i) => s + i.price * i.quantity, 0));
  readonly deliveryFee = computed(() => (this._items().length > 0 ? DELIVERY_FEE_INR : 0));
  readonly total = computed(() => this.subtotal() + this.deliveryFee());

  constructor() {
    // Persist cart to Firestore on every change for signed-in users.
    effect(() => {
      const user = this.auth.user();
      const items = this._items();
      if (!user) return;
      void setDoc(doc(this.db, `cart/${user.uid}`), {
        userId: user.uid,
        items,
        updatedAt: serverTimestamp(),
      }, { merge: true });
    });

    // Load cart on login.
    effect(() => {
      const user = this.auth.user();
      if (!user) { this._items.set([]); return; }
      void this.hydrate(user.uid);
    });
  }

  private async hydrate(uid: string): Promise<void> {
    const snap = await getDoc(doc(this.db, `cart/${uid}`));
    if (snap.exists()) {
      const data = snap.data() as { items?: CartItem[] };
      this._items.set(data.items ?? []);
    }
  }

  add(product: Product, quantity = 1): void {
    const items = [...this._items()];
    const idx = items.findIndex((i) => i.productId === product.id);
    const item: CartItem = {
      productId: product.id,
      name: product.name,
      thumbnail: product.thumbnail,
      price: product.discountPrice ?? product.price,
      unit: product.unit,
      quantity: idx >= 0 ? items[idx].quantity + quantity : quantity,
    };
    if (idx >= 0) items[idx] = item; else items.push(item);
    this._items.set(items);
  }

  increment(productId: string): void {
    this._items.set(this._items().map((i) =>
      i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i));
  }

  decrement(productId: string): void {
    this._items.set(this._items()
      .map((i) => i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i)
      .filter((i) => i.quantity > 0));
  }

  remove(productId: string): void {
    this._items.set(this._items().filter((i) => i.productId !== productId));
  }

  clear(): void { this._items.set([]); }

  toggleFavorite(productId: string): void {
    const favs = this._favorites();
    this._favorites.set(favs.includes(productId) ? favs.filter((id) => id !== productId) : [...favs, productId]);
  }

  isFavorite(productId: string): boolean {
    return this._favorites().includes(productId);
  }
}
