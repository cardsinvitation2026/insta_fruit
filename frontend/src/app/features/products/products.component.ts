<<<<<<< HEAD
import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { LucideAngularModule, ChevronLeft, SlidersHorizontal } from 'lucide-angular';
import { PRODUCTS } from '../../core/data/mock-data';
import { ProductCardComponent } from '../../shared/product-card.component';
import { BottomNavbarComponent } from '../../shared/bottom-navbar.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ProductCardComponent, BottomNavbarComponent],
  template: `
    <div data-testid="products-page" class="min-h-screen bg-[#FAFAFA] pb-28">
      <!-- Sticky header -->
      <div class="sticky top-0 z-30 bg-white px-5 pt-12 pb-4 border-b border-border-soft/50">
        <div class="flex items-center justify-between">
          <button data-testid="back-btn" (click)="back()" class="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
            <lucide-icon [img]="ChevronIcon" [size]="20" class="text-primary"></lucide-icon>
          </button>
          <h1 class="text-[16px] font-extrabold text-text-primary">All Products</h1>
          <button class="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
            <lucide-icon [img]="FilterIcon" [size]="18" class="text-primary"></lucide-icon>
          </button>
        </div>
        <div class="flex gap-2 mt-4 overflow-x-auto no-scrollbar -mx-5 px-5">
          @for (tab of tabs; track tab) {
            <button
              [class.bg-primary]="active === tab"
              [class.text-white]="active === tab"
              [class.bg-primary-light]="active !== tab"
              [class.text-primary]="active !== tab"
              (click)="active = tab"
              class="flex-shrink-0 px-4 py-2 rounded-full text-[12px] font-semibold"
            >{{ tab }}</button>
          }
        </div>
      </div>

      <div class="px-5 pt-5 grid grid-cols-2 gap-4">
        @for (p of products; track p.id) {
          <app-product-card [product]="p"></app-product-card>
        }
      </div>

      <app-bottom-navbar></app-bottom-navbar>
    </div>
  `,
})
export class ProductsComponent {
  private readonly location = inject(Location);
  readonly products = PRODUCTS;
  readonly tabs = ['All', 'Fruits', 'Berries', 'Tropical', 'Citrus'];
  active = 'All';
  readonly ChevronIcon = ChevronLeft;
  readonly FilterIcon = SlidersHorizontal;
  back(): void { this.location.back(); }
}
=======
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { LucideAngularModule, ChevronLeft, SlidersHorizontal } from 'lucide-angular';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductsService } from '../../core/services/products.service';
import { CategoriesService } from '../../core/services/categories.service';
import { ProductCardComponent } from '../../shared/product-card.component';
import { BottomNavbarComponent } from '../../shared/bottom-navbar.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ProductCardComponent, BottomNavbarComponent],
  template: `
    <div data-testid="products-page" class="min-h-screen bg-[#FAFAFA] pb-28">
      <div class="sticky top-0 z-30 bg-white px-5 pt-12 pb-4 border-b border-border-soft/50">
        <div class="flex items-center justify-between">
          <button data-testid="back-btn" (click)="back()" class="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
            <lucide-icon [img]="ChevronIcon" [size]="20" class="text-primary"></lucide-icon>
          </button>
          <h1 class="text-[16px] font-extrabold text-text-primary">All Products</h1>
          <button class="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
            <lucide-icon [img]="FilterIcon" [size]="18" class="text-primary"></lucide-icon>
          </button>
        </div>
        <div class="flex gap-2 mt-4 overflow-x-auto no-scrollbar -mx-5 px-5">
          <button [class.bg-primary]="active() === ''" [class.text-white]="active() === ''"
                  [class.bg-primary-light]="active() !== ''" [class.text-primary]="active() !== ''"
                  (click)="active.set('')" class="flex-shrink-0 px-4 py-2 rounded-full text-[12px] font-semibold">All</button>
          @for (cat of categories(); track cat.id) {
            <button [class.bg-primary]="active() === cat.id" [class.text-white]="active() === cat.id"
                    [class.bg-primary-light]="active() !== cat.id" [class.text-primary]="active() !== cat.id"
                    (click)="active.set(cat.id)" class="flex-shrink-0 px-4 py-2 rounded-full text-[12px] font-semibold">{{ cat.name }}</button>
          }
        </div>
      </div>

      <div class="px-5 pt-5 grid grid-cols-2 gap-4">
        @for (p of filtered(); track p.id) {
          <app-product-card [product]="p"></app-product-card>
        } @empty {
          <div class="col-span-2 text-center text-[13px] text-text-secondary py-12">No products in this category.</div>
        }
      </div>

      <app-bottom-navbar></app-bottom-navbar>
    </div>
  `,
})
export class ProductsComponent {
  private readonly location = inject(Location);
  private readonly productsSvc = inject(ProductsService);
  private readonly catsSvc = inject(CategoriesService);

  readonly products = toSignal(this.productsSvc.list(), { initialValue: [] });
  readonly categories = toSignal(this.catsSvc.list(), { initialValue: [] });
  readonly active = signal<string>('');
  readonly filtered = computed(() =>
    this.active() ? this.products().filter((p) => p.categoryId === this.active()) : this.products()
  );

  readonly ChevronIcon = ChevronLeft;
  readonly FilterIcon = SlidersHorizontal;
  back(): void { this.location.back(); }
}
>>>>>>> ca60e8a5bf13a682a56baf8d78e19218f4d17277
