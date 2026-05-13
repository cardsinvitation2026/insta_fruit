<<<<<<< HEAD
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule, ChevronLeft, Heart, Star, ShoppingBag } from 'lucide-angular';
import { PRODUCTS, Product } from '../../core/data/mock-data';
import { CartService } from '../../core/services/cart.service';
import { QuantitySelectorComponent } from '../../shared/quantity-selector.component';
import { ProductCardComponent } from '../../shared/product-card.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, QuantitySelectorComponent, ProductCardComponent],
  template: `
    @if (product()) {
      <div data-testid="product-details-page" class="min-h-screen pb-28 relative">
        <!-- Top image area -->
        <div class="relative px-5 pt-12 pb-10" style="background:#EAF7EC; border-bottom-left-radius:36px; border-bottom-right-radius:36px;">
          <div class="flex items-center justify-between">
            <button data-testid="back-btn" (click)="back()" class="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-soft">
              <lucide-icon [img]="ChevronIcon" [size]="20" class="text-text-primary"></lucide-icon>
            </button>
            <button data-testid="fav-btn" (click)="toggleFav()" class="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-soft">
              <lucide-icon
                [img]="HeartIcon"
                [size]="18"
                [class.text-red-500]="isFav()"
                [class.fill-red-500]="isFav()"
                class="text-text-secondary"
              ></lucide-icon>
            </button>
          </div>
          <div class="flex items-center justify-center mt-4">
            <img [src]="product()!.image" [alt]="product()!.name" class="h-52 w-52 object-contain drop-shadow-2xl" />
          </div>
        </div>

        <!-- Info -->
        <div class="px-5 pt-6">
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-[24px] font-extrabold text-text-primary leading-tight">{{ product()!.name }}</h1>
              <p class="text-[13px] text-text-secondary mt-1">{{ product()!.unit }}</p>
            </div>
            <span data-testid="product-price" class="text-[22px] font-extrabold text-primary">₹{{ product()!.price.toFixed(2) }}</span>
          </div>

          <div class="flex items-center justify-between mt-5">
            <div class="flex items-center gap-1.5 bg-primary-light px-3 py-1.5 rounded-full">
              <lucide-icon [img]="StarIcon" [size]="14" class="text-yellow-400 fill-yellow-400"></lucide-icon>
              <span class="text-[12px] font-bold text-text-primary">{{ product()!.rating }}</span>
              <span class="text-[11px] text-text-secondary">(128 reviews)</span>
            </div>
            <app-quantity-selector [value]="qty()" (inc)="qty.set(qty()+1)" (dec)="qty.set(qty()>1?qty()-1:1)"></app-quantity-selector>
          </div>

          <div class="mt-6">
            <h2 class="text-[15px] font-bold text-text-primary mb-2">Description</h2>
            <p class="text-[13px] text-text-secondary leading-relaxed">{{ product()!.description }}</p>
          </div>

          <div class="mt-7">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-[15px] font-bold text-text-primary">Related products</h2>
              <a class="text-[12px] text-primary font-semibold">See all</a>
            </div>
            <div class="grid grid-cols-2 gap-4">
              @for (p of related; track p.id) {
                <app-product-card [product]="p"></app-product-card>
              }
            </div>
          </div>
        </div>

        <!-- Fixed bottom add to cart -->
        <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app bg-white border-t border-border-soft px-5 py-4 z-40">
          <button
            data-testid="add-to-cart-btn"
            (click)="addToCart()"
            class="w-full h-14 bg-primary text-white rounded-btn flex items-center justify-center gap-2 text-[15px] font-bold shadow-green active:scale-[0.98]"
          >
            <lucide-icon [img]="BagIcon" [size]="18"></lucide-icon>
            Add to Cart • ₹{{ (product()!.price * qty()).toFixed(2) }}
          </button>
        </div>
      </div>
    }
  `,
})
export class ProductDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly cart = inject(CartService);

  readonly qty = signal(1);
  readonly product = signal<Product | undefined>(undefined);
  readonly ChevronIcon = ChevronLeft;
  readonly HeartIcon = Heart;
  readonly StarIcon = Star;
  readonly BagIcon = ShoppingBag;
  readonly related = PRODUCTS.slice(0, 4);

  readonly isFav = computed(() => (this.product() ? this.cart.isFavorite(this.product()!.id) : false));

  constructor() {
    this.route.paramMap.subscribe((p) => {
      const id = Number(p.get('id'));
      this.product.set(PRODUCTS.find((x) => x.id === id) ?? PRODUCTS[0]);
      this.qty.set(1);
    });
  }

  back(): void { this.location.back(); }
  toggleFav(): void { if (this.product()) this.cart.toggleFavorite(this.product()!.id); }
  addToCart(): void {
    if (!this.product()) return;
    this.cart.add(this.product()!, this.qty());
    this.router.navigate(['/cart']);
  }
}
=======
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule, ChevronLeft, Heart, Star, ShoppingBag } from 'lucide-angular';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, of } from 'rxjs';
import { ProductsService } from '../../core/services/products.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models';
import { QuantitySelectorComponent } from '../../shared/quantity-selector.component';
import { ProductCardComponent } from '../../shared/product-card.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, QuantitySelectorComponent, ProductCardComponent],
  template: `
    @if (product(); as p) {
      <div data-testid="product-details-page" class="min-h-screen pb-28 relative">
        <div class="relative px-5 pt-12 pb-10"
             style="background:#EAF7EC; border-bottom-left-radius:36px; border-bottom-right-radius:36px;">
          <div class="flex items-center justify-between">
            <button data-testid="back-btn" (click)="back()" class="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-soft">
              <lucide-icon [img]="ChevronIcon" [size]="20" class="text-text-primary"></lucide-icon>
            </button>
            <button data-testid="fav-btn" (click)="toggleFav()" class="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-soft">
              <lucide-icon [img]="HeartIcon" [size]="18"
                [class.text-red-500]="isFav()" [class.fill-red-500]="isFav()"
                class="text-text-secondary"></lucide-icon>
            </button>
          </div>
          <div class="flex items-center justify-center mt-4">
            <img [src]="p.thumbnail" [alt]="p.name" class="h-52 w-52 object-contain drop-shadow-2xl" />
          </div>
        </div>

        <div class="px-5 pt-6">
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-[24px] font-extrabold text-text-primary leading-tight">{{ p.name }}</h1>
              <p class="text-[13px] text-text-secondary mt-1">{{ p.unit }}</p>
            </div>
            <span data-testid="product-price" class="text-[22px] font-extrabold text-primary">₹{{ (p.discountPrice ?? p.price).toFixed(2) }}</span>
          </div>

          <div class="flex items-center justify-between mt-5">
            <div class="flex items-center gap-1.5 bg-primary-light px-3 py-1.5 rounded-full">
              <lucide-icon [img]="StarIcon" [size]="14" class="text-yellow-400 fill-yellow-400"></lucide-icon>
              <span class="text-[12px] font-bold text-text-primary">{{ p.rating ?? 4.5 }}</span>
              <span class="text-[11px] text-text-secondary">(128 reviews)</span>
            </div>
            <app-quantity-selector [value]="qty()" (inc)="qty.set(qty()+1)" (dec)="qty.set(qty()>1?qty()-1:1)"></app-quantity-selector>
          </div>

          <div class="mt-6">
            <h2 class="text-[15px] font-bold text-text-primary mb-2">Description</h2>
            <p class="text-[13px] text-text-secondary leading-relaxed">{{ p.description }}</p>
          </div>

          <div class="mt-7">
            <div class="flex items-center justify-between mb-3">
              <h2 class="text-[15px] font-bold text-text-primary">Related products</h2>
              <a class="text-[12px] text-primary font-semibold">See all</a>
            </div>
            <div class="grid grid-cols-2 gap-4">
              @for (rp of related(); track rp.id) {
                <app-product-card [product]="rp"></app-product-card>
              }
            </div>
          </div>
        </div>

        <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app bg-white border-t border-border-soft px-5 py-4 z-40">
          <button data-testid="add-to-cart-btn" (click)="addToCart()"
                  class="w-full h-14 bg-primary text-white rounded-btn flex items-center justify-center gap-2 text-[15px] font-bold shadow-green active:scale-[0.98]">
            <lucide-icon [img]="BagIcon" [size]="18"></lucide-icon>
            Add to Cart • ₹{{ ((p.discountPrice ?? p.price) * qty()).toFixed(2) }}
          </button>
        </div>
      </div>
    } @else {
      <div class="min-h-screen flex items-center justify-center text-text-secondary text-sm">Loading product…</div>
    }
  `,
})
export class ProductDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly cart = inject(CartService);
  private readonly productsSvc = inject(ProductsService);

  readonly qty = signal(1);
  readonly ChevronIcon = ChevronLeft; readonly HeartIcon = Heart; readonly StarIcon = Star; readonly BagIcon = ShoppingBag;

  private readonly id = toSignal(this.route.paramMap, { initialValue: null });
  readonly product = toSignal(
    this.route.paramMap.pipe(
      switchMap((pm) => {
        const id = pm.get('id') ?? '';
        return id ? this.productsSvc.one(id) : of(undefined);
      })
    ),
    { initialValue: undefined as Product | undefined }
  );

  readonly related = toSignal(this.productsSvc.list(), { initialValue: [] });
  readonly isFav = computed(() => {
    const p = this.product();
    return p?.id ? this.cart.isFavorite(p.id) : false;
  });

  back(): void { this.location.back(); }
  toggleFav(): void {
    const p = this.product();
    if (p?.id) this.cart.toggleFavorite(p.id);
  }
  addToCart(): void {
    const p = this.product();
    if (!p) return;
    this.cart.add(p, this.qty());
    this.router.navigate(['/cart']);
  }
}
>>>>>>> ca60e8a5bf13a682a56baf8d78e19218f4d17277
