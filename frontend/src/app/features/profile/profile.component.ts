import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, Phone, MapPin, ShoppingBag, Heart, CreditCard, Bell, HelpCircle, LogOut, ChevronRight, Pencil, ShieldCheck, Loader2 } from 'lucide-angular';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../core/services/auth.service';
import { OrdersService } from '../../core/services/orders.service';
import { StorageService } from '../../core/services/storage.service';
import { BottomNavbarComponent } from '../../shared/bottom-navbar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, BottomNavbarComponent],
  template: `
    <div data-testid="profile-page" class="min-h-screen bg-[#FAFAFA] pb-28">
      <div class="px-5 pt-12 pb-12 text-white relative overflow-hidden"
           style="background:#08B44D; border-bottom-left-radius:32px; border-bottom-right-radius:32px;">
        <div class="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10"></div>
        <h1 class="text-[18px] font-extrabold relative">My Profile</h1>
      </div>

      <div class="px-5 -mt-8 relative z-10">
        <div class="bg-white rounded-card p-4 shadow-soft-lg flex items-center gap-4">
          <div class="relative shrink-0">
            <img [src]="profileImage()"
                 class="w-16 h-16 rounded-full object-cover border-2 border-white shadow-soft transition-opacity"
                 [class.opacity-60]="avatarUploading()"
                 alt="Profile photo" />
            <button type="button"
                    data-testid="change-avatar-btn"
                    (click)="avatarInput.click()"
                    [disabled]="avatarUploading()"
                    [attr.aria-busy]="avatarUploading()"
                    [attr.aria-label]="avatarUploading() ? 'Uploading photo' : 'Change profile photo'"
                    class="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary border-2 border-white flex items-center justify-center shadow-soft disabled:opacity-50 active:scale-95">
              @if (avatarUploading()) {
                <lucide-icon [img]="LoaderIcon" [size]="14" class="text-white animate-spin"></lucide-icon>
              } @else {
                <lucide-icon [img]="PencilIcon" [size]="10" class="text-white"></lucide-icon>
              }
            </button>
            <input #avatarInput type="file" accept="image/jpeg,image/png,image/webp,image/gif" class="sr-only"
                   (change)="onAvatarSelected($event, avatarInput)" />
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-[16px] font-extrabold text-text-primary" data-testid="profile-name">{{ profile()?.fullName || 'Welcome' }}</h2>
            @if (avatarError()) {
              <p class="text-[11px] text-red-500 font-semibold mt-1" data-testid="avatar-error">{{ avatarError() }}</p>
            }
            <p class="text-[12px] text-text-secondary flex items-center gap-1.5 mt-0.5">
              <lucide-icon [img]="PhoneIcon" [size]="11"></lucide-icon>{{ profile()?.phone || '—' }}
            </p>
            <p class="text-[12px] text-text-secondary flex items-center gap-1.5 mt-0.5">
              <lucide-icon [img]="MapIcon" [size]="11"></lucide-icon>{{ profile()?.email }}
            </p>
          </div>
        </div>
      </div>

      <div class="px-5 mt-5 grid grid-cols-3 gap-3">
        <div class="bg-white rounded-card p-3 text-center shadow-soft">
          <p class="text-[18px] font-extrabold text-primary">{{ orders().length }}</p>
          <p class="text-[11px] text-text-secondary mt-0.5">Orders</p>
        </div>
        <div class="bg-white rounded-card p-3 text-center shadow-soft">
          <p class="text-[18px] font-extrabold text-primary">{{ deliveredCount() }}</p>
          <p class="text-[11px] text-text-secondary mt-0.5">Delivered</p>
        </div>
        <div class="bg-white rounded-card p-3 text-center shadow-soft">
          <p class="text-[18px] font-extrabold text-primary">4.9</p>
          <p class="text-[11px] text-text-secondary mt-0.5">Rating</p>
        </div>
      </div>

      <div class="px-5 mt-7">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-[14px] font-bold text-text-primary">Order History</h3>
          <a class="text-[12px] text-primary font-semibold">View all</a>
        </div>
        <div class="space-y-3">
          @for (o of orders().slice(0,3); track o.orderId) {
            <div [attr.data-testid]="'order-' + o.orderId" class="bg-white rounded-card p-3 shadow-soft flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center text-xl">🍊</div>
              <div class="flex-1">
                <p class="text-[13px] font-bold text-text-primary">Order #{{ o.orderId.slice(-8).toUpperCase() }}</p>
                <p class="text-[11px] text-text-secondary">{{ o.products.length }} items</p>
              </div>
              <div class="text-right">
                <p class="text-[13px] font-extrabold text-primary">₹{{ o.total.toFixed(2) }}</p>
                <span class="text-[10px] bg-primary-light text-primary px-2 py-0.5 rounded-full font-semibold">{{ o.orderStatus }}</span>
              </div>
            </div>
          } @empty {
            <p class="text-[12px] text-text-secondary text-center py-4">No orders yet.</p>
          }
        </div>
      </div>

      <div class="px-5 mt-7 space-y-2">
        @if (isAdmin()) {
          <button (click)="goAdmin()" data-testid="goto-admin"
                  class="w-full bg-white rounded-card p-3.5 shadow-soft flex items-center gap-3 ring-1 ring-primary/30">
            <div class="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <lucide-icon [img]="AdminIcon" [size]="16" class="text-white"></lucide-icon>
            </div>
            <span class="flex-1 text-left text-[13px] font-semibold text-text-primary">Admin Panel</span>
            <lucide-icon [img]="ChevronIcon" [size]="16" class="text-text-secondary"></lucide-icon>
          </button>
        }
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
  private readonly auth = inject(AuthService);
  private readonly ordersSvc = inject(OrdersService);
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);

  readonly avatarUploading = signal(false);
  readonly avatarError = signal<string | null>(null);

  readonly profile = this.auth.profile;
  readonly isAdmin = this.auth.isAdmin;
  readonly orders = toSignal(
    this.ordersSvc.myOrders(this.auth.user()?.uid ?? '_'),
    { initialValue: [] }
  );
  readonly deliveredCount = computed(() => this.orders().filter((o) => o.orderStatus === 'delivered').length);
  readonly profileImage = computed(() => this.profile()?.profileImage ?? 'https://i.pravatar.cc/100?img=47');

  readonly PhoneIcon = Phone; readonly MapIcon = MapPin; readonly PencilIcon = Pencil;
  readonly LoaderIcon = Loader2;
  readonly ChevronIcon = ChevronRight; readonly LogoutIcon = LogOut; readonly AdminIcon = ShieldCheck;

  readonly menu = [
    { label: 'My Orders', icon: ShoppingBag },
    { label: 'Wishlist', icon: Heart },
    { label: 'Payment Methods', icon: CreditCard },
    { label: 'Notifications', icon: Bell },
    { label: 'Help & Support', icon: HelpCircle },
  ];

  async logout(): Promise<void> { await this.auth.signOutUser(); }
  goAdmin(): void { this.router.navigate(['/admin/dashboard']); }

  async onAvatarSelected(event: Event, input: HTMLInputElement): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    input.value = '';
    if (!file) return;

    const uid = this.auth.user()?.uid;
    if (!uid) {
      this.avatarError.set('You need to be signed in to update your photo.');
      return;
    }

    this.avatarError.set(null);
    this.avatarUploading.set(true);
    try {
      const url = await this.storage.upload('users', file);
      await this.auth.updateProfile(uid, { profileImage: url });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not update photo.';
      this.avatarError.set(msg);
    } finally {
      this.avatarUploading.set(false);
    }
  }
}
