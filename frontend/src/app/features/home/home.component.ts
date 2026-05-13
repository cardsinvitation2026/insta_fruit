<<<<<<< HEAD
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
              Avanti Vihar, Raipur, Chhattisgarh 492001
              <lucide-icon [img]="ChevronIcon" [size]="16"></lucide-icon>
            </button>
          </div>
          <button data-testid="notification-btn" class="w-11 h-11 rounded-full bg-white/15 backdrop-blur flex items-center justify-center relative">
            <lucide-icon [img]="BellIcon" [size]="18"></lucide-icon>
            <span class="absolute top-2.5 right-3 w-2 h-2 rounded-full bg-red-400"></span>
          </button>
        </div>
        <h1 class="text-2xl font-extrabold leading-tight">Hello, Keshav 👋</h1>
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
=======
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, MapPin, Bell, ChevronDown } from 'lucide-angular';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductsService } from '../../core/services/products.service';
import { CategoriesService } from '../../core/services/categories.service';
import { BannersService } from '../../core/services/banners.service';
import { AuthService } from '../../core/services/auth.service';
import { ProductCardComponent } from '../../shared/product-card.component';
import { SearchBarComponent } from '../../shared/search-bar.component';
import { BottomNavbarComponent } from '../../shared/bottom-navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ProductCardComponent, SearchBarComponent, BottomNavbarComponent],
  template: `
    <div data-testid="home-page" class="min-h-screen pb-28" style="background:#FAFAFA;">
      <div class="px-5 pt-12 pb-8 text-white relative overflow-hidden"
           style="background:#08B44D; border-bottom-left-radius:32px; border-bottom-right-radius:32px;">
        <div class="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10"></div>
        <div class="absolute right-16 bottom-2 w-20 h-20 rounded-full bg-white/10"></div>
        <div class="relative flex items-start justify-between mb-5">
          <div>
            <div class="flex items-center gap-1.5 text-white/80 text-[11px] font-semibold mb-0.5">
              <lucide-icon [img]="MapPinIcon" [size]="12"></lucide-icon>
              <span>Deliver to</span>
            </div>
            <button class="flex items-center gap-1 text-white text-[15px] font-bold">
              {{ city() }}
              <lucide-icon [img]="ChevronIcon" [size]="16"></lucide-icon>
            </button>
          </div>
          <button data-testid="notification-btn" class="w-11 h-11 rounded-full bg-white/15 backdrop-blur flex items-center justify-center relative">
            <lucide-icon [img]="BellIcon" [size]="18"></lucide-icon>
            <span class="absolute top-2.5 right-3 w-2 h-2 rounded-full bg-red-400"></span>
          </button>
        </div>
        <h1 class="text-2xl font-extrabold leading-tight">Hello, {{ firstName() }} 👋</h1>
        <p class="text-white/85 text-[13px] mt-1">What fresh fruits today?</p>
      </div>

      <div class="px-5 -mt-6 relative z-10">
        <app-search-bar></app-search-bar>
      </div>

      <!-- Promo banner from Firestore (uses first active banner) -->
      <div class="px-5 mt-6">
        @if (firstBanner(); as b) {
          <div data-testid="promo-banner"
               class="relative rounded-card overflow-hidden text-white p-5 shadow-soft-lg"
               style="background: linear-gradient(120deg,#08B44D 0%,#00963F 100%);">
            <div class="relative z-10 max-w-[60%]">
              @if (b.subtitle) {
                <span class="inline-block bg-white/20 backdrop-blur px-3 py-1 rounded-full text-[11px] font-semibold mb-3">{{ b.subtitle }}</span>
              }
              <h3 class="text-xl font-extrabold leading-tight mb-1">{{ b.title }}</h3>
              @if (b.ctaLabel) {
                <button class="mt-3 inline-flex items-center gap-2 bg-white text-primary text-[12px] font-bold rounded-full px-4 py-2 shadow-soft">{{ b.ctaLabel }}</button>
              }
            </div>
            <div class="absolute -right-6 -bottom-4 w-40 h-40 rounded-full bg-white/10"></div>
            <img [src]="b.imageUrl" alt="banner" class="absolute right-0 bottom-0 h-36 w-36 object-cover rounded-full shadow-2xl border-4 border-white/20" />
          </div>
        } @else {
          <div class="relative rounded-card overflow-hidden text-white p-5 shadow-soft-lg" style="background: linear-gradient(120deg,#08B44D 0%,#00963F 100%);">
            <div class="relative z-10 max-w-[60%]">
              <span class="inline-block bg-white/20 backdrop-blur px-3 py-1 rounded-full text-[11px] font-semibold mb-3">Welcome</span>
              <h3 class="text-xl font-extrabold leading-tight mb-1">Fresh fruits<br/>delivered fast</h3>
              <p class="text-[12px] text-white/80 mb-4">Add Firebase config & seed data to start</p>
            </div>
            <div class="absolute -right-6 -bottom-4 w-40 h-40 rounded-full bg-white/10"></div>
          </div>
        }
      </div>

      <!-- Categories -->
      <div class="px-5 mt-7">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-[17px] font-extrabold text-text-primary">Categories</h2>
          <a class="text-[12px] text-primary font-semibold" (click)="goProducts()">See all</a>
        </div>
        <div class="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-5 px-5">
          @for (cat of categories(); track cat.id) {
            <button [attr.data-testid]="'category-' + cat.id" (click)="selectedCategory.set(cat.id)"
                    class="flex-shrink-0 flex flex-col items-center gap-2 px-4 py-3 rounded-2xl transition-all"
                    [class.bg-white]="selectedCategory() !== cat.id"
                    [class.shadow-soft]="selectedCategory() !== cat.id"
                    [class.bg-primary]="selectedCategory() === cat.id"
                    [class.text-white]="selectedCategory() === cat.id">
              <div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl overflow-hidden"
                   [style.background]="selectedCategory() === cat.id ? 'rgba(255,255,255,0.18)' : '#EAF7EC'">
                @if (cat.imageUrl) {
                  <img [src]="cat.imageUrl" [alt]="cat.name" class="w-10 h-10 object-contain" />
                } @else {
                  <span>{{ cat.icon ?? '🍎' }}</span>
                }
              </div>
              <span class="text-[12px] font-semibold">{{ cat.name }}</span>
            </button>
          } @empty {
            <span class="text-[12px] text-text-secondary py-3">No categories yet — add from admin panel.</span>
          }
        </div>
      </div>

      <!-- Popular -->
      <div class="px-5 mt-7">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-[17px] font-extrabold text-text-primary">Popular Products</h2>
          <a data-testid="see-all-products" class="text-[12px] text-primary font-semibold cursor-pointer" (click)="goProducts()">See all</a>
        </div>
        <div class="grid grid-cols-2 gap-4">
          @for (p of popular(); track p.id) {
            <app-product-card [product]="p"></app-product-card>
          } @empty {
            <div class="col-span-2 text-center text-[12px] text-text-secondary py-10">
              No products yet. Sign in as admin and add products to get started.
            </div>
          }
        </div>
      </div>

      <app-bottom-navbar></app-bottom-navbar>
    </div>
  `,
})
export class HomeComponent {
  private readonly router = inject(Router);
  private readonly productsSvc = inject(ProductsService);
  private readonly catsSvc = inject(CategoriesService);
  private readonly bannersSvc = inject(BannersService);
  private readonly auth = inject(AuthService);

  readonly MapPinIcon = MapPin; readonly BellIcon = Bell; readonly ChevronIcon = ChevronDown;

  readonly categories = toSignal(this.catsSvc.list(), { initialValue: [] });
  readonly banners = toSignal(this.bannersSvc.list(), { initialValue: [] });
  readonly products = toSignal(this.productsSvc.list(), { initialValue: [] });

  readonly firstBanner = computed(() => this.banners()[0]);
  readonly popular = computed(() => this.products().slice(0, 6));
  readonly selectedCategory = signal<string>('');
  readonly firstName = computed(() => (this.auth.profile()?.fullName ?? '').split(' ')[0] || 'there');
  readonly city = computed(() => this.auth.profile()?.defaultAddress?.city ?? 'Your city');

  goProducts(): void { this.router.navigate(['/products']); }
}
>>>>>>> ca60e8a5bf13a682a56baf8d78e19218f4d17277
