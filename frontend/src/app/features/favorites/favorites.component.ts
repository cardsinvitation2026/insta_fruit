<<<<<<< HEAD
import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Heart } from 'lucide-angular';
import { PRODUCTS } from '../../core/data/mock-data';
import { CartService } from '../../core/services/cart.service';
import { ProductCardComponent } from '../../shared/product-card.component';
import { BottomNavbarComponent } from '../../shared/bottom-navbar.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ProductCardComponent, BottomNavbarComponent],
  template: `
    <div data-testid="favorites-page" class="min-h-screen bg-[#FAFAFA] pb-28">
      <div class="px-5 pt-12 pb-4 bg-white border-b border-border-soft/50">
        <h1 class="text-[18px] font-extrabold text-text-primary">My Favorites</h1>
        <p class="text-[12px] text-text-secondary mt-0.5">{{ favorites().length }} items</p>
      </div>

      @if (favorites().length === 0) {
        <div class="flex flex-col items-center justify-center text-center px-8 py-20">
          <div class="w-24 h-24 rounded-full bg-primary-light flex items-center justify-center mb-5">
            <lucide-icon [img]="HeartIcon" [size]="40" class="text-primary"></lucide-icon>
          </div>
          <h2 class="text-[18px] font-extrabold text-text-primary">No favorites yet</h2>
          <p class="text-[13px] text-text-secondary mt-1.5">Tap the heart icon on products to save them here.</p>
        </div>
      } @else {
        <div class="px-5 pt-5 grid grid-cols-2 gap-4">
          @for (p of favorites(); track p.id) {
            <app-product-card [product]="p"></app-product-card>
          }
        </div>
      }

      <app-bottom-navbar></app-bottom-navbar>
    </div>
  `,
})
export class FavoritesComponent {
  private readonly cart = inject(CartService);
  readonly HeartIcon = Heart;
  readonly favorites = computed(() => PRODUCTS.filter((p) => this.cart.favorites().includes(p.id)));
}
=======
import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Heart } from 'lucide-angular';
import { toSignal } from '@angular/core/rxjs-interop';
import { CartService } from '../../core/services/cart.service';
import { ProductsService } from '../../core/services/products.service';
import { ProductCardComponent } from '../../shared/product-card.component';
import { BottomNavbarComponent } from '../../shared/bottom-navbar.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ProductCardComponent, BottomNavbarComponent],
  template: `
    <div data-testid="favorites-page" class="min-h-screen bg-[#FAFAFA] pb-28">
      <div class="px-5 pt-12 pb-4 bg-white border-b border-border-soft/50">
        <h1 class="text-[18px] font-extrabold text-text-primary">My Favorites</h1>
        <p class="text-[12px] text-text-secondary mt-0.5">{{ favorites().length }} items</p>
      </div>

      @if (favorites().length === 0) {
        <div class="flex flex-col items-center justify-center text-center px-8 py-20">
          <div class="w-24 h-24 rounded-full bg-primary-light flex items-center justify-center mb-5">
            <lucide-icon [img]="HeartIcon" [size]="40" class="text-primary"></lucide-icon>
          </div>
          <h2 class="text-[18px] font-extrabold text-text-primary">No favorites yet</h2>
          <p class="text-[13px] text-text-secondary mt-1.5">Tap the heart icon on products to save them here.</p>
        </div>
      } @else {
        <div class="px-5 pt-5 grid grid-cols-2 gap-4">
          @for (p of favorites(); track p.id) {
            <app-product-card [product]="p"></app-product-card>
          }
        </div>
      }

      <app-bottom-navbar></app-bottom-navbar>
    </div>
  `,
})
export class FavoritesComponent {
  private readonly cart = inject(CartService);
  private readonly productsSvc = inject(ProductsService);
  readonly HeartIcon = Heart;
  private readonly all = toSignal(this.productsSvc.list(), { initialValue: [] });
  readonly favorites = computed(() => this.all().filter((p) => this.cart.favorites().includes(p.id)));
}
>>>>>>> ca60e8a5bf13a682a56baf8d78e19218f4d17277
