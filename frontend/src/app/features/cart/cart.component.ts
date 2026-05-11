import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, ChevronLeft, Trash2, Plus, Minus, ShoppingBag } from 'lucide-angular';
import { CartService } from '../../core/services/cart.service';
import { BottomNavbarComponent } from '../../shared/bottom-navbar.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, BottomNavbarComponent],
  template: `
    <div data-testid="cart-page" class="min-h-screen bg-[#FAFAFA] pb-44">
      <div class="px-5 pt-12 pb-4 flex items-center justify-between bg-white border-b border-border-soft/50">
        <button data-testid="back-btn" (click)="back()" class="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
          <lucide-icon [img]="ChevronIcon" [size]="20" class="text-primary"></lucide-icon>
        </button>
        <h1 class="text-[16px] font-extrabold text-text-primary">My Cart</h1>
        <div class="w-10"></div>
      </div>

      @if (items().length === 0) {
        <div class="flex flex-col items-center justify-center text-center px-8 py-20">
          <div class="w-24 h-24 rounded-full bg-primary-light flex items-center justify-center mb-5">
            <lucide-icon [img]="BagIcon" [size]="40" class="text-primary"></lucide-icon>
          </div>
          <h2 class="text-[18px] font-extrabold text-text-primary">Your cart is empty</h2>
          <p class="text-[13px] text-text-secondary mt-1.5 mb-6">Looks like you haven't added any fruits yet.</p>
          <button data-testid="continue-shop" (click)="goShop()" class="bg-primary text-white px-6 py-3 rounded-btn text-[14px] font-bold shadow-green">Continue Shopping</button>
        </div>
      } @else {
        <div class="px-5 pt-5 space-y-3">
          @for (i of items(); track i.product.id) {
            <div [attr.data-testid]="'cart-item-' + i.product.id" class="bg-white rounded-card p-3 shadow-soft flex items-center gap-3">
              <div class="w-20 h-20 rounded-2xl bg-primary-light flex items-center justify-center flex-shrink-0">
                <img [src]="i.product.image" [alt]="i.product.name" class="w-16 h-16 object-contain" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-[14px] font-bold text-text-primary truncate">{{ i.product.name }}</h3>
                <p class="text-[11px] text-text-secondary">{{ i.product.unit }}</p>
                <p class="text-[15px] font-extrabold text-primary mt-1">₹{{ (i.product.price * i.quantity).toFixed(2) }}</p>
              </div>
              <div class="flex flex-col items-end gap-2">
                <button [attr.data-testid]="'remove-' + i.product.id" (click)="remove(i.product.id)" class="text-text-secondary">
                  <lucide-icon [img]="TrashIcon" [size]="16"></lucide-icon>
                </button>
                <div class="flex items-center gap-2 bg-primary-light rounded-full px-1 py-1">
                  <button [attr.data-testid]="'dec-' + i.product.id" (click)="dec(i.product.id)" class="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                    <lucide-icon [img]="MinusIcon" [size]="12" class="text-primary"></lucide-icon>
                  </button>
                  <span class="text-[12px] font-bold w-4 text-center">{{ i.quantity }}</span>
                  <button [attr.data-testid]="'inc-' + i.product.id" (click)="inc(i.product.id)" class="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <lucide-icon [img]="PlusIcon" [size]="12" class="text-white"></lucide-icon>
                  </button>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Summary -->
        <div class="px-5 mt-6">
          <div class="bg-white rounded-card p-4 shadow-soft space-y-2">
            <div class="flex justify-between text-[13px]"><span class="text-text-secondary">Subtotal</span><span class="font-semibold" data-testid="cart-subtotal">₹{{ subtotal().toFixed(2) }}</span></div>
            <div class="flex justify-between text-[13px]"><span class="text-text-secondary">Delivery fee</span><span class="font-semibold">₹{{ deliveryFee().toFixed(2) }}</span></div>
            <div class="h-px bg-border-soft my-2"></div>
            <div class="flex justify-between text-[15px] font-extrabold"><span>Total</span><span class="text-primary" data-testid="cart-total">₹{{ total().toFixed(2) }}</span></div>
          </div>
        </div>

        <!-- Checkout button -->
        <div class="fixed bottom-[75px] left-1/2 -translate-x-1/2 w-full max-w-app bg-white border-t border-border-soft px-5 py-3 z-30">
          <button
            data-testid="checkout-btn"
            (click)="checkout()"
            class="w-full h-14 bg-primary text-white rounded-btn text-[15px] font-bold shadow-green active:scale-[0.98]"
          >Proceed to Checkout</button>
        </div>
      }

      <app-bottom-navbar></app-bottom-navbar>
    </div>
  `,
})
export class CartComponent {
  private readonly cart = inject(CartService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  readonly items = this.cart.items;
  readonly subtotal = this.cart.subtotal;
  readonly deliveryFee = this.cart.deliveryFee;
  readonly total = this.cart.total;
  readonly ChevronIcon = ChevronLeft;
  readonly TrashIcon = Trash2;
  readonly PlusIcon = Plus;
  readonly MinusIcon = Minus;
  readonly BagIcon = ShoppingBag;

  inc(id: number): void { this.cart.increment(id); }
  dec(id: number): void { this.cart.decrement(id); }
  remove(id: number): void { this.cart.remove(id); }
  checkout(): void { this.router.navigate(['/checkout']); }
  goShop(): void { this.router.navigate(['/products']); }
  back(): void { this.location.back(); }
}
