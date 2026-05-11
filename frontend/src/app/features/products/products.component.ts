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
  back() { this.location.back(); }
}
