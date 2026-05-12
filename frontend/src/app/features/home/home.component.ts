import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, MapPin, Bell, ChevronDown } from 'lucide-angular';
import { PRODUCTS, CATEGORIES, Category } from '../../core/data/mock-data';
import { ProductCardComponent } from '../../shared/product-card.component';
import { SearchBarComponent } from '../../shared/search-bar.component';
import { PromoBannerComponent } from '../../shared/promo-banner.component';
import { BottomNavbarComponent } from '../../shared/bottom-navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
    ProductCardComponent,
    SearchBarComponent,
    PromoBannerComponent,
    BottomNavbarComponent,
  ],
  template: `
    <div data-testid="home-page" class="min-h-screen pb-28" style="background:#FAFAFA;">
      <!-- Green header -->
      <div class="px-5 pt-12 pb-8 text-white relative overflow-hidden" style="background:#08B44D; border-bottom-left-radius:32px; border-bottom-right-radius:32px;">
        <div class="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10"></div>
        <div class="absolute right-16 bottom-2 w-20 h-20 rounded-full bg-white/10"></div>
        <div class="relative flex items-start justify-between mb-5">
          <div>
            <div class="flex items-center gap-1.5 text-white/80 text-[11px] font-semibold mb-0.5">
              <lucide-icon [img]="MapPinIcon" [size]="12"></lucide-icon>
              <span>Deliver to</span>
            </div>
            <button class="flex items-center gap-1 text-white text-[15px] font-bold">
              Avanti Vihar, Raipur, Chhattisgarh
              <lucide-icon [img]="ChevronIcon" [size]="16"></lucide-icon>
            </button>
          </div>
          <button data-testid="notification-btn" class="w-11 h-11 rounded-full bg-white/15 backdrop-blur flex items-center justify-center relative">
            <lucide-icon [img]="BellIcon" [size]="18"></lucide-icon>
            <span class="absolute top-2.5 right-3 w-2 h-2 rounded-full bg-red-400"></span>
          </button>
        </div>
        <h1 class="text-2xl font-extrabold leading-tight">Hello, Olivia 👋</h1>
        <p class="text-white/85 text-[13px] mt-1">What fresh fruits today?</p>
      </div>

      <!-- Search bar floating -->
      <div class="px-5 -mt-6 relative z-10">
        <app-search-bar></app-search-bar>
      </div>

      <!-- Promo banner -->
      <div class="px-5 mt-6">
        <app-promo-banner></app-promo-banner>
      </div>

      <!-- Categories -->
      <div class="px-5 mt-7">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-[17px] font-extrabold text-text-primary">Categories</h2>
          <a class="text-[12px] text-primary font-semibold">See all</a>
        </div>
        <div class="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-5 px-5">
          @for (cat of categories; track cat.id) {
            <button
              [attr.data-testid]="'category-' + cat.id"
              (click)="selectedCategory.set(cat.name)"
              class="flex-shrink-0 flex flex-col items-center gap-2 px-4 py-3 rounded-2xl transition-all"
              [class.bg-white]="selectedCategory() !== cat.name"
              [class.shadow-soft]="selectedCategory() !== cat.name"
              [class.bg-primary]="selectedCategory() === cat.name"
              [class.text-white]="selectedCategory() === cat.name"
            >
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                [style.background]="selectedCategory() === cat.name ? 'rgba(255,255,255,0.18)' : cat.color"
              >{{ cat.icon }}</div>
              <span class="text-[12px] font-semibold">{{ cat.name }}</span>
            </button>
          }
        </div>
      </div>

      <!-- Popular -->
      <div class="px-5 mt-7">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-[17px] font-extrabold text-text-primary">Popular Products</h2>
          <a routerLink="/products" data-testid="see-all-products" class="text-[12px] text-primary font-semibold" style="cursor:pointer;" (click)="goProducts()">See all</a>
        </div>
        <div class="grid grid-cols-2 gap-4">
          @for (p of popular; track p.id) {
            <app-product-card [product]="p"></app-product-card>
          }
        </div>
      </div>

      <app-bottom-navbar></app-bottom-navbar>
    </div>
  `,
})
export class HomeComponent {
  private readonly router = inject(Router);
  readonly MapPinIcon = MapPin;
  readonly BellIcon = Bell;
  readonly ChevronIcon = ChevronDown;
  readonly categories: Category[] = CATEGORIES;
  readonly popular = PRODUCTS.slice(0, 4);
  readonly selectedCategory = signal<string>('Fruits');

  goProducts(): void { this.router.navigate(['/products']); }
}
