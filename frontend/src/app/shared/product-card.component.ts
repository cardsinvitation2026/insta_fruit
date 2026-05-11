import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, Heart, Plus, Star } from 'lucide-angular';
import { Product } from '../core/data/mock-data';
import { CartService } from '../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div
      [attr.data-testid]="'product-card-' + product().id"
      class="bg-white rounded-card shadow-soft p-4 relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-soft-lg cursor-pointer"
      (click)="open()"
    >
      <button
        [attr.data-testid]="'wishlist-' + product().id"
        type="button"
        class="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-soft z-10"
        (click)="$event.stopPropagation(); toggleFav()"
      >
        <lucide-icon
          [img]="HeartIcon"
          [size]="16"
          [class.fill-red-500]="isFav()"
          [class.text-red-500]="isFav()"
          class="text-[#7A7A7A]"
        ></lucide-icon>
      </button>
      <div class="h-28 flex items-center justify-center mb-3 bg-primary-light rounded-2xl">
        <img [src]="product().image" [alt]="product().name" class="h-24 w-24 object-contain drop-shadow-md" />
      </div>
      <div class="flex items-center gap-1 mb-1">
        <lucide-icon [img]="StarIcon" [size]="12" class="text-yellow-400 fill-yellow-400"></lucide-icon>
        <span class="text-[11px] font-semibold text-text-secondary">{{ product().rating }}</span>
      </div>
      <h3 class="text-[15px] font-bold text-text-primary leading-tight">{{ product().name }}</h3>
      <p class="text-[11px] text-text-secondary mb-3">{{ product().unit }}</p>
      <div class="flex items-center justify-between">
        <span class="text-[16px] font-extrabold text-text-primary">₹{{ product().price.toFixed(2) }}</span>
        <button
          [attr.data-testid]="'add-product-' + product().id"
          type="button"
          (click)="$event.stopPropagation(); add()"
          class="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shadow-green active:scale-95"
        >
          <lucide-icon [img]="PlusIcon" [size]="18"></lucide-icon>
        </button>
      </div>
    </div>
  `,
})
export class ProductCardComponent {
  private readonly router = inject(Router);
  private readonly cart = inject(CartService);
  readonly product = input.required<Product>();
  readonly HeartIcon = Heart;
  readonly PlusIcon = Plus;
  readonly StarIcon = Star;

  readonly isFav = computed(() => this.cart.isFavorite(this.product().id));

  open(): void {
    this.router.navigate(['/product', this.product().id]);
  }

  add(): void {
    this.cart.add(this.product(), 1);
  }

  toggleFav(): void {
    this.cart.toggleFavorite(this.product().id);
  }
}
