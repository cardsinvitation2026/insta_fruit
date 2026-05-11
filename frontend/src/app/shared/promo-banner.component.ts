import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, ArrowRight } from 'lucide-angular';

@Component({
  selector: 'app-promo-banner',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div
      data-testid="promo-banner"
      class="relative rounded-card overflow-hidden text-white p-5 shadow-soft-lg"
      style="background: linear-gradient(120deg,#08B44D 0%,#00963F 100%);"
    >
      <div class="relative z-10 max-w-[60%]">
        <span class="inline-block bg-white/20 backdrop-blur px-3 py-1 rounded-full text-[11px] font-semibold mb-3">Limited time</span>
        <h3 class="text-xl font-extrabold leading-tight mb-1">Get 30% off on<br/>your first order</h3>
        <p class="text-[12px] text-white/80 mb-4">Fresh fruits delivered in 30 mins</p>
        <button
          data-testid="promo-shop-btn"
          type="button"
          class="inline-flex items-center gap-2 bg-white text-primary text-[12px] font-bold rounded-full px-4 py-2 shadow-soft"
        >
          Shop Now
          <lucide-icon [img]="ArrowIcon" [size]="14"></lucide-icon>
        </button>
      </div>
      <div class="absolute -right-6 -bottom-4 w-40 h-40 rounded-full bg-white/10"></div>
      <div class="absolute right-2 top-2 w-16 h-16 rounded-full bg-white/10"></div>
      <img
        src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80"
        alt="fruits"
        class="absolute right-0 bottom-0 h-36 w-36 object-cover rounded-full shadow-2xl border-4 border-white/20"
      />
    </div>
  `,
})
export class PromoBannerComponent {
  readonly ArrowIcon = ArrowRight;
}
