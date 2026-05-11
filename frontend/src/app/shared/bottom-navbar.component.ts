import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, Home, Heart, ShoppingBag, User } from 'lucide-angular';
import { CartService } from '../core/services/cart.service';

@Component({
  selector: 'app-bottom-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <nav
      data-testid="bottom-navbar"
      class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-app bg-white border-t border-[#EAEAEA] z-40"
      style="height:75px; box-shadow:0 -4px 20px rgba(0,0,0,0.05);"
    >
      <div class="grid grid-cols-4 h-full px-2">
        <a
          routerLink="/home"
          routerLinkActive="text-primary"
          [routerLinkActiveOptions]="{ exact: false }"
          data-testid="nav-home"
          class="flex flex-col items-center justify-center gap-1 text-[#8A8A8A]"
        >
          <lucide-icon [img]="HomeIcon" [size]="22"></lucide-icon>
          <span class="text-[11px] font-semibold">Home</span>
        </a>
        <a
          routerLink="/favorites"
          routerLinkActive="text-primary"
          data-testid="nav-favorite"
          class="flex flex-col items-center justify-center gap-1 text-[#8A8A8A]"
        >
          <lucide-icon [img]="HeartIcon" [size]="22"></lucide-icon>
          <span class="text-[11px] font-semibold">Favorite</span>
        </a>
        <a
          routerLink="/cart"
          routerLinkActive="text-primary"
          data-testid="nav-cart"
          class="flex flex-col items-center justify-center gap-1 text-[#8A8A8A] relative"
        >
          <div class="relative">
            <lucide-icon [img]="BagIcon" [size]="22"></lucide-icon>
            @if (count() > 0) {
              <span
                data-testid="cart-badge"
                class="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
              >{{ count() }}</span>
            }
          </div>
          <span class="text-[11px] font-semibold">Cart</span>
        </a>
        <a
          routerLink="/profile"
          routerLinkActive="text-primary"
          data-testid="nav-profile"
          class="flex flex-col items-center justify-center gap-1 text-[#8A8A8A]"
        >
          <lucide-icon [img]="UserIcon" [size]="22"></lucide-icon>
          <span class="text-[11px] font-semibold">Profile</span>
        </a>
      </div>
    </nav>
  `,
})
export class BottomNavbarComponent {
  private readonly cart = inject(CartService);
  readonly count = computed(() => this.cart.count());
  readonly HomeIcon = Home;
  readonly HeartIcon = Heart;
  readonly BagIcon = ShoppingBag;
  readonly UserIcon = User;
}
