<<<<<<< HEAD
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, Check } from 'lucide-angular';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div data-testid="order-success-page" class="min-h-screen flex flex-col items-center justify-center px-8 text-center" style="background:#FAFAFA;">
      <div class="animate-scale-in flex flex-col items-center">
        <div class="relative w-28 h-28 mb-6">
          <div class="absolute inset-0 rounded-full bg-primary-light animate-pulse"></div>
          <div class="absolute inset-3 rounded-full bg-primary flex items-center justify-center shadow-green">
            <lucide-icon [img]="CheckIcon" [size]="48" class="text-white"></lucide-icon>
          </div>
        </div>
        <h1 class="text-[24px] font-extrabold text-text-primary">Order Placed!</h1>
        <p class="text-[13px] text-text-secondary mt-2 max-w-[280px] leading-relaxed">
          Your fresh fruits are on their way. We'll deliver in about 30 minutes.
        </p>

        <div class="bg-white rounded-card shadow-soft p-4 mt-8 w-full max-w-[320px]">
          <p class="text-[11px] text-text-secondary">Order ID</p>
          <p class="text-[15px] font-bold text-text-primary mt-0.5">#IF{{ orderId }}</p>
        </div>

        <button
          data-testid="track-order-btn"
          (click)="track()"
          class="mt-8 w-full max-w-[320px] h-14 bg-primary text-white rounded-btn text-[15px] font-bold shadow-green active:scale-[0.98]"
        >Track Your Order</button>
        <button
          data-testid="go-home-btn"
          (click)="home()"
          class="mt-3 w-full max-w-[320px] h-14 bg-white text-primary border border-primary/30 rounded-btn text-[15px] font-bold"
        >Back to Home</button>
      </div>
    </div>
  `,
})
export class OrderSuccessComponent {
  private readonly router = inject(Router);
  readonly CheckIcon = Check;
  readonly orderId = Math.floor(100000 + Math.random() * 900000);
  track(): void { this.router.navigate(['/track-order']); }
  home(): void { this.router.navigate(['/home']); }
}
=======
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule, Check } from 'lucide-angular';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div data-testid="order-success-page" class="min-h-screen flex flex-col items-center justify-center px-8 text-center" style="background:#FAFAFA;">
      <div class="animate-scale-in flex flex-col items-center">
        <div class="relative w-28 h-28 mb-6">
          <div class="absolute inset-0 rounded-full bg-primary-light animate-pulse"></div>
          <div class="absolute inset-3 rounded-full bg-primary flex items-center justify-center shadow-green">
            <lucide-icon [img]="CheckIcon" [size]="48" class="text-white"></lucide-icon>
          </div>
        </div>
        <h1 class="text-[24px] font-extrabold text-text-primary">Order Placed!</h1>
        <p class="text-[13px] text-text-secondary mt-2 max-w-[280px] leading-relaxed">
          Your fresh fruits are on their way. We'll deliver in about 30 minutes.
        </p>

        <div class="bg-white rounded-card shadow-soft p-4 mt-8 w-full max-w-[320px]">
          <p class="text-[11px] text-text-secondary">Order ID</p>
          <p class="text-[15px] font-bold text-text-primary mt-0.5">#{{ shortId() }}</p>
        </div>

        <button data-testid="track-order-btn" (click)="track()"
                class="mt-8 w-full max-w-[320px] h-14 bg-primary text-white rounded-btn text-[15px] font-bold shadow-green active:scale-[0.98]">Track Your Order</button>
        <button data-testid="go-home-btn" (click)="home()"
                class="mt-3 w-full max-w-[320px] h-14 bg-white text-primary border border-primary/30 rounded-btn text-[15px] font-bold">Back to Home</button>
      </div>
    </div>
  `,
})
export class OrderSuccessComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly CheckIcon = Check;
  readonly orderId = this.route.snapshot.paramMap.get('id') ?? '';
  shortId(): string { return this.orderId.slice(-8).toUpperCase(); }
  track(): void { this.router.navigate(['/track-order', this.orderId]); }
  home(): void { this.router.navigate(['/home']); }
}
>>>>>>> ca60e8a5bf13a682a56baf8d78e19218f4d17277
