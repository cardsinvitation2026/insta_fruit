import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, Package, FolderTree, Image, ShoppingBag, Users, Undo2, LogOut, Leaf, ArrowLeft } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, LucideAngularModule],
  styles: [`
    :host { display: block; }
    /* Allow admin to break out of mobile shell on desktop */
    @media (min-width: 768px) {
      :host { 
        position: fixed;
        inset: 0;
        z-index: 50;
        overflow-y: auto;
      }
    }
  `],
  template: `
    <div data-testid="admin-layout" class="min-h-screen bg-[#F5F7F6] md:flex">
      <!-- Sidebar (desktop) / top bar (mobile) -->
      <aside class="md:w-64 md:min-h-screen bg-white md:border-r border-border-soft flex md:flex-col">
        <div class="px-5 py-4 md:py-5 md:py-7 space-y-3 border-b border-border-soft">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
              <lucide-icon [img]="LeafIcon" [size]="18" class="text-white"></lucide-icon>
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-[14px] font-extrabold text-text-primary leading-tight truncate md:truncate-none">InstaFruit</p>
              <p class="text-[11px] text-text-secondary">Admin Console</p>
            </div>
          </div>
          <a routerLink="/home" data-testid="admin-back-store"
             class="flex items-center justify-center md:justify-start gap-2 px-3 py-2 rounded-xl text-[13px] font-semibold bg-primary-light/70 hover:bg-primary-light text-primary border border-primary/15">
            <lucide-icon [img]="BackIcon" [size]="16"></lucide-icon>
            Back to store
          </a>
        </div>
        <nav class="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible px-3 py-3 md:py-5 flex-1">
          @for (item of nav; track item.path) {
            <a [routerLink]="item.path" routerLinkActive="bg-primary text-white shadow-green"
               [routerLinkActiveOptions]="{ exact: false }"
               [attr.data-testid]="'admin-nav-' + item.id"
               class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-text-secondary hover:bg-primary-light whitespace-nowrap">
              <lucide-icon [img]="item.icon" [size]="16"></lucide-icon>
              <span>{{ item.label }}</span>
            </a>
          }
        </nav>
        <div class="hidden md:block p-3 border-t border-border-soft">
          <div class="text-[12px] text-text-secondary mb-2 px-2">
            <p class="font-bold text-text-primary">{{ profile()?.fullName }}</p>
            <p class="truncate">{{ profile()?.email }}</p>
          </div>
          <button data-testid="admin-logout" (click)="logout()"
                  class="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-semibold text-red-500 bg-red-50">
            <lucide-icon [img]="LogoutIcon" [size]="14"></lucide-icon>Log out
          </button>
        </div>
      </aside>

      <main class="flex-1 min-w-0 p-5 md:p-8">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class AdminLayoutComponent {
  private readonly auth = inject(AuthService);
  readonly profile = this.auth.profile;
  readonly LeafIcon = Leaf; readonly LogoutIcon = LogOut; readonly BackIcon = ArrowLeft;

  readonly nav = [
    { id: 'dashboard', label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', path: '/admin/products', icon: Package },
    { id: 'categories', label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { id: 'banners', label: 'Banners', path: '/admin/banners', icon: Image },
    { id: 'orders', label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { id: 'users', label: 'Users', path: '/admin/users', icon: Users },
    { id: 'refunds', label: 'Refunds', path: '/admin/refunds', icon: Undo2 },
  ];

  async logout(): Promise<void> { await this.auth.signOutUser(); }
}
