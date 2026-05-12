import { Component, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, ChevronLeft, MapPin, Wallet, Banknote, Pencil } from 'lucide-angular';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div data-testid="checkout-page" class="min-h-screen bg-[#FAFAFA] pb-32">
      <div class="px-5 pt-12 pb-4 flex items-center justify-between bg-white border-b border-border-soft/50">
        <button data-testid="back-btn" (click)="back()" class="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
          <lucide-icon [img]="ChevronIcon" [size]="20" class="text-primary"></lucide-icon>
        </button>
        <h1 class="text-[16px] font-extrabold text-text-primary">Checkout</h1>
        <div class="w-10"></div>
      </div>

      <div class="px-5 pt-5 space-y-5">
        <!-- Address -->
        <div>
          <h2 class="text-[14px] font-bold text-text-primary mb-2">Delivery Address</h2>
          <div data-testid="address-card" class="bg-white rounded-card p-4 shadow-soft flex items-start gap-3">
            <div class="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
              <lucide-icon [img]="MapPinIcon" [size]="18" class="text-primary"></lucide-icon>
            </div>
            <div class="flex-1">
              <p class="text-[13px] font-bold text-text-primary">Home</p>
              <p class="text-[12px] text-text-secondary leading-relaxed mt-0.5">Avanti Vihar, Raipur, Chhattisgarh 492001</p>
            </div>
            <button class="text-primary"><lucide-icon [img]="PencilIcon" [size]="16"></lucide-icon></button>
          </div>
        </div>

        <!-- Payment methods -->
        <div>
          <h2 class="text-[14px] font-bold text-text-primary mb-2">Payment Method</h2>
          <div class="space-y-3">
            <button
              data-testid="payment-cod"
              (click)="payment.set('cod')"
              class="w-full bg-white rounded-card p-4 shadow-soft flex items-center gap-3 transition-all"
              [class.ring-2]="payment() === 'cod'"
              [class.ring-primary]="payment() === 'cod'"
            >
              <div class="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                <lucide-icon [img]="CashIcon" [size]="18" class="text-primary"></lucide-icon>
              </div>
              <div class="flex-1 text-left">
                <p class="text-[13px] font-bold text-text-primary">Cash on Delivery</p>
                <p class="text-[11px] text-text-secondary">Pay when your order arrives</p>
              </div>
              <span class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                [class.border-primary]="payment() === 'cod'"
                [class.border-border-soft]="payment() !== 'cod'">
                @if (payment() === 'cod') { <span class="w-2.5 h-2.5 rounded-full bg-primary"></span> }
              </span>
            </button>

            <button
              data-testid="payment-razorpay"
              (click)="payment.set('razorpay')"
              class="w-full bg-white rounded-card p-4 shadow-soft flex items-center gap-3 transition-all"
              [class.ring-2]="payment() === 'razorpay'"
              [class.ring-primary]="payment() === 'razorpay'"
            >
              <div class="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                <lucide-icon [img]="WalletIcon" [size]="18" class="text-primary"></lucide-icon>
              </div>
              <div class="flex-1 text-left">
                <p class="text-[13px] font-bold text-text-primary">Razorpay</p>
                <p class="text-[11px] text-text-secondary">UPI, Cards, Wallets, Net banking</p>
              </div>
              <span class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                [class.border-primary]="payment() === 'razorpay'"
                [class.border-border-soft]="payment() !== 'razorpay'">
                @if (payment() === 'razorpay') { <span class="w-2.5 h-2.5 rounded-full bg-primary"></span> }
              </span>
            </button>
          </div>
        </div>

        <!-- Price summary -->
        <div>
          <h2 class="text-[14px] font-bold text-text-primary mb-2">Price Summary</h2>
          <div class="bg-white rounded-card p-4 shadow-soft space-y-2">
            <div class="flex justify-between text-[13px]"><span class="text-text-secondary">Subtotal</span><span class="font-semibold">₹{{ cart.subtotal().toFixed(2) }}</span></div>
            <div class="flex justify-between text-[13px]"><span class="text-text-secondary">Delivery fee</span><span class="font-semibold">₹{{ cart.deliveryFee().toFixed(2) }}</span></div>
            <div class="flex justify-between text-[13px]"><span class="text-text-secondary">Discount</span><span class="font-semibold text-primary">- $0.00</span></div>
            <div class="h-px bg-border-soft my-2"></div>
            <div class="flex justify-between text-[15px] font-extrabold"><span>Total</span><span class="text-primary">₹{{ cart.total().toFixed(2) }}</span></div>
          </div>
        </div>
      </div>

      <!-- Place order -->
      <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app bg-white border-t border-border-soft px-5 py-4 z-40">
        <button
          data-testid="place-order-btn"
          (click)="placeOrder()"
          class="w-full h-14 bg-primary text-white rounded-btn text-[15px] font-bold shadow-green active:scale-[0.98]"
        >Place Order • ₹{{ cart.total().toFixed(2) }}</button>
      </div>
    </div>
  `,
})
export class CheckoutComponent {
  readonly cart = inject(CartService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  readonly payment = signal<'cod' | 'razorpay'>('cod');
  readonly ChevronIcon = ChevronLeft;
  readonly MapPinIcon = MapPin;
  readonly WalletIcon = Wallet;
  readonly CashIcon = Banknote;
  readonly PencilIcon = Pencil;

  placeOrder(): void {
    this.cart.clear();
    this.router.navigate(['/order-success']);
  }
  back(): void { this.location.back(); }
}
