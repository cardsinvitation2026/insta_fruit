import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, Phone, MapPin, ShoppingBag, Heart, CreditCard, Bell, HelpCircle, LogOut, ChevronRight, Pencil } from 'lucide-angular';
import { BottomNavbarComponent } from '../../shared/bottom-navbar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, BottomNavbarComponent],
  template: `
    <div data-testid="profile-page" class="min-h-screen bg-[#FAFAFA] pb-28">
      <!-- header -->
      <div class="px-5 pt-12 pb-12 text-white relative overflow-hidden" style="background:#08B44D; border-bottom-left-radius:32px; border-bottom-right-radius:32px;">
        <div class="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10"></div>
        <h1 class="text-[18px] font-extrabold relative">My Profile</h1>
      </div>

      <!-- profile card -->
      <div class="px-5 -mt-8 relative z-10">
        <div class="bg-white rounded-card p-4 shadow-soft-lg flex items-center gap-4">
          <div class="relative">
            <img src="https://i.pravatar.cc/100?img=47" class="w-16 h-16 rounded-full object-cover border-2 border-white shadow-soft" alt="avatar" />
            <button class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary border-2 border-white flex items-center justify-center">
              <lucide-icon [img]="PencilIcon" [size]="10" class="text-white"></lucide-icon>
            </button>
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-[16px] font-extrabold text-text-primary" data-testid="profile-name">Keshav Shukla</h2>
            <p class="text-[12px] text-text-secondary flex items-center gap-1.5 mt-0.5">
              <lucide-icon [img]="PhoneIcon" [size]="11"></lucide-icon>
              +1 (415) 555-0142
            </p>
            <p class="text-[12px] text-text-secondary flex items-center gap-1.5 mt-0.5">
              <lucide-icon [img]="MapIcon" [size]="11"></lucide-icon>
              San Francisco, CA
            </p>
          </div>
        </div>
      </div>

      <!-- stats -->
      <div class="px-5 mt-5 grid grid-cols-3 gap-3">
        <div class="bg-white rounded-card p-3 text-center shadow-soft">
          <p class="text-[18px] font-extrabold text-primary">24</p>
          <p class="text-[11px] text-text-secondary mt-0.5">Orders</p>
        </div>
        <div class="bg-white rounded-card p-3 text-center shadow-soft">
          <p class="text-[18px] font-extrabold text-primary">12</p>
          <p class="text-[11px] text-text-secondary mt-0.5">Wishlist</p>
        </div>
        <div class="bg-white rounded-card p-3 text-center shadow-soft">
          <p class="text-[18px] font-extrabold text-primary">4.9</p>
          <p class="text-[11px] text-text-secondary mt-0.5">Rating</p>
        </div>
      </div>

      <!-- order history -->
      <div class="px-5 mt-7">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-[14px] font-bold text-text-primary">Order History</h3>
          <a class="text-[12px] text-primary font-semibold">View all</a>
        </div>
        <div class="space-y-3">
          @for (o of orders; track o.id) {
            <div [attr.data-testid]="'order-' + o.id" class="bg-white rounded-card p-3 shadow-soft flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center text-xl">{{ o.icon }}</div>
              <div class="flex-1">
                <p class="text-[13px] font-bold text-text-primary">{{ o.title }}</p>
                <p class="text-[11px] text-text-secondary">{{ o.date }} • {{ o.items }} items</p>
              </div>
              <div class="text-right">
                <p class="text-[13px] font-extrabold text-primary">₹{{ o.total }}</p>
                <span class="text-[10px] bg-primary-light text-primary px-2 py-0.5 rounded-full font-semibold">{{ o.status }}</span>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- menu -->
      <div class="px-5 mt-7 space-y-2">
        @for (m of menu; track m.label) {
          <button class="w-full bg-white rounded-card p-3.5 shadow-soft flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center">
              <lucide-icon [img]="m.icon" [size]="16" class="text-primary"></lucide-icon>
            </div>
            <span class="flex-1 text-left text-[13px] font-semibold text-text-primary">{{ m.label }}</span>
            <lucide-icon [img]="ChevronIcon" [size]="16" class="text-text-secondary"></lucide-icon>
          </button>
        }
      </div>

      <!-- logout -->
      <div class="px-5 mt-5">
        <button data-testid="logout-btn" (click)="logout()" class="w-full bg-white rounded-card p-3.5 shadow-soft flex items-center gap-3 text-red-500">
          <div class="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
            <lucide-icon [img]="LogoutIcon" [size]="16"></lucide-icon>
          </div>
          <span class="flex-1 text-left text-[13px] font-semibold">Log out</span>
        </button>
      </div>

      <app-bottom-navbar></app-bottom-navbar>
    </div>
  `,
})
export class ProfileComponent {
  private readonly router = inject(Router);
  readonly PhoneIcon = Phone;
  readonly MapIcon = MapPin;
  readonly PencilIcon = Pencil;
  readonly ChevronIcon = ChevronRight;
  readonly LogoutIcon = LogOut;

  readonly orders = [
    { id: 1, icon: '🍊', title: 'Order #IF483920', date: 'Feb 12, 2026', items: 4, total: '24.50', status: 'Delivered' },
    { id: 2, icon: '🥭', title: 'Order #IF483851', date: 'Feb 08, 2026', items: 2, total: '12.99', status: 'Delivered' },
    { id: 3, icon: '🫐', title: 'Order #IF483712', date: 'Feb 03, 2026', items: 6, total: '38.20', status: 'Delivered' },
  ];

  readonly menu = [
    { label: 'My Orders', icon: ShoppingBag },
    { label: 'Wishlist', icon: Heart },
    { label: 'Payment Methods', icon: CreditCard },
    { label: 'Notifications', icon: Bell },
    { label: 'Help & Support', icon: HelpCircle },
  ];

  logout(): void { this.router.navigate(['/login']); }
}
