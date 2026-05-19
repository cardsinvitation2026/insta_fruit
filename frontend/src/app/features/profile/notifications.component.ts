import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { LucideAngularModule, ChevronLeft, Bell } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { BottomNavbarComponent } from '../../shared/bottom-navbar.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, BottomNavbarComponent],
  template: `
    <div data-testid="notifications-page" class="min-h-screen bg-[#FAFAFA] pb-28">
      <div class="px-5 pt-12 pb-4 flex items-center justify-between bg-white border-b border-border-soft/50">
        <button type="button" (click)="back()" class="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
          <lucide-icon [img]="ChevronIcon" [size]="20" class="text-primary"></lucide-icon>
        </button>
        <h1 class="text-[16px] font-extrabold text-text-primary">Notifications</h1>
        <div class="w-10"></div>
      </div>

      <div class="px-5 pt-6 space-y-3">
        <div class="bg-white rounded-card p-4 shadow-soft flex gap-3">
          <div class="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center shrink-0">
            <lucide-icon [img]="BellIcon" [size]="18" class="text-primary"></lucide-icon>
          </div>
          <div>
            <p class="text-[13px] font-bold text-text-primary">Order updates</p>
            <p class="text-[12px] text-text-secondary mt-1 leading-relaxed">
              You will see order status on the track-order screen. Email alerts go to
              <span class="font-semibold text-text-primary">{{ auth.profile()?.email || 'your account email' }}</span>.
            </p>
          </div>
        </div>
        <p class="text-[11px] text-text-secondary text-center px-4">Push notifications can be added in a future update.</p>
      </div>

      <app-bottom-navbar></app-bottom-navbar>
    </div>
  `,
})
export class NotificationsComponent {
  private readonly location = inject(Location);
  readonly auth = inject(AuthService);
  readonly ChevronIcon = ChevronLeft;
  readonly BellIcon = Bell;
  back(): void { this.location.back(); }
}
