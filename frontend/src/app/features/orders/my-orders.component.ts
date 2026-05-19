import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, ChevronLeft, ShoppingBag } from 'lucide-angular';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, of } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { OrdersService } from '../../core/services/orders.service';
import { BottomNavbarComponent } from '../../shared/bottom-navbar.component';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, BottomNavbarComponent],
  template: `
    <div data-testid="my-orders-page" class="min-h-screen bg-[#FAFAFA] pb-28">
      <div class="px-5 pt-12 pb-4 flex items-center justify-between bg-white border-b border-border-soft/50">
        <button type="button" data-testid="back-btn" (click)="back()" class="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
          <lucide-icon [img]="ChevronIcon" [size]="20" class="text-primary"></lucide-icon>
        </button>
        <h1 class="text-[16px] font-extrabold text-text-primary">My Orders</h1>
        <div class="w-10"></div>
      </div>

      @if (orders().length === 0) {
        <div class="flex flex-col items-center justify-center text-center px-8 py-20">
          <div class="w-24 h-24 rounded-full bg-primary-light flex items-center justify-center mb-5">
            <lucide-icon [img]="BagIcon" [size]="40" class="text-primary"></lucide-icon>
          </div>
          <h2 class="text-[18px] font-extrabold text-text-primary">No orders yet</h2>
          <p class="text-[13px] text-text-secondary mt-1.5">Your orders will appear here after checkout.</p>
        </div>
      } @else {
        <div class="px-5 pt-5 space-y-3">
          @for (o of orders(); track o.orderId) {
            <button type="button" [attr.data-testid]="'order-row-' + o.orderId"
                    (click)="track(o.orderId)"
                    class="w-full bg-white rounded-card p-4 shadow-soft flex items-center gap-3 text-left active:scale-[0.99]">
              <div class="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center text-xl">🍊</div>
              <div class="flex-1 min-w-0">
                <p class="text-[13px] font-bold text-text-primary">Order #{{ o.orderId.slice(-8).toUpperCase() }}</p>
                <p class="text-[11px] text-text-secondary">{{ o.products.length }} items · {{ o.paymentMethod | uppercase }}</p>
              </div>
              <div class="text-right shrink-0">
                <p class="text-[13px] font-extrabold text-primary">₹{{ o.total.toFixed(2) }}</p>
                <span class="text-[10px] bg-primary-light text-primary px-2 py-0.5 rounded-full font-semibold capitalize">{{ statusLabel(o.orderStatus) }}</span>
              </div>
            </button>
          }
        </div>
      }

      <app-bottom-navbar></app-bottom-navbar>
    </div>
  `,
})
export class MyOrdersComponent {
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly ordersSvc = inject(OrdersService);

  readonly ChevronIcon = ChevronLeft;
  readonly BagIcon = ShoppingBag;

  readonly orders = toSignal(
    toObservable(this.auth.user).pipe(
      switchMap((u) => (u ? this.ordersSvc.myOrders(u.uid) : of([]))),
    ),
    { initialValue: [] },
  );

  back(): void { this.location.back(); }
  track(orderId: string): void { void this.router.navigate(['/track-order', orderId]); }
  statusLabel(status: string): string { return status.replace(/([A-Z])/g, ' $1').trim(); }
}
