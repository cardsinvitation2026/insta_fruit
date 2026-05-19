import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { LucideAngularModule, ChevronLeft, Banknote, Wallet } from 'lucide-angular';
import { BottomNavbarComponent } from '../../shared/bottom-navbar.component';

@Component({
  selector: 'app-payment-methods',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, BottomNavbarComponent],
  template: `
    <div data-testid="payment-methods-page" class="min-h-screen bg-[#FAFAFA] pb-28">
      <div class="px-5 pt-12 pb-4 flex items-center justify-between bg-white border-b border-border-soft/50">
        <button type="button" (click)="back()" class="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
          <lucide-icon [img]="ChevronIcon" [size]="20" class="text-primary"></lucide-icon>
        </button>
        <h1 class="text-[16px] font-extrabold text-text-primary">Payment Methods</h1>
        <div class="w-10"></div>
      </div>

      <p class="px-5 pt-4 text-[12px] text-text-secondary">Choose a method at checkout. Saved cards are not stored yet.</p>

      <div class="px-5 pt-4 space-y-3">
        <div class="bg-white rounded-card p-4 shadow-soft flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
            <lucide-icon [img]="CashIcon" [size]="18" class="text-primary"></lucide-icon>
          </div>
          <div>
            <p class="text-[13px] font-bold text-text-primary">Cash on Delivery</p>
            <p class="text-[11px] text-text-secondary">Pay when your order arrives</p>
          </div>
        </div>
        <div class="bg-white rounded-card p-4 shadow-soft flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
            <lucide-icon [img]="WalletIcon" [size]="18" class="text-primary"></lucide-icon>
          </div>
          <div>
            <p class="text-[13px] font-bold text-text-primary">Razorpay</p>
            <p class="text-[11px] text-text-secondary">UPI, cards, wallets, net banking</p>
          </div>
        </div>
      </div>

      <app-bottom-navbar></app-bottom-navbar>
    </div>
  `,
})
export class PaymentMethodsComponent {
  private readonly location = inject(Location);
  readonly ChevronIcon = ChevronLeft;
  readonly CashIcon = Banknote;
  readonly WalletIcon = Wallet;
  back(): void { this.location.back(); }
}
