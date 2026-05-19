import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { LucideAngularModule, ChevronLeft, HelpCircle, Mail, Phone } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { BottomNavbarComponent } from '../../shared/bottom-navbar.component';

@Component({
  selector: 'app-help-support',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, BottomNavbarComponent],
  template: `
    <div data-testid="help-support-page" class="min-h-screen bg-[#FAFAFA] pb-28">
      <div class="px-5 pt-12 pb-4 flex items-center justify-between bg-white border-b border-border-soft/50">
        <button type="button" (click)="back()" class="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
          <lucide-icon [img]="ChevronIcon" [size]="20" class="text-primary"></lucide-icon>
        </button>
        <h1 class="text-[16px] font-extrabold text-text-primary">Help &amp; Support</h1>
        <div class="w-10"></div>
      </div>

      <div class="px-5 pt-6 space-y-3">
        <div class="bg-white rounded-card p-4 shadow-soft">
          <div class="flex items-center gap-2 mb-2">
            <lucide-icon [img]="HelpIcon" [size]="18" class="text-primary"></lucide-icon>
            <p class="text-[13px] font-bold text-text-primary">FAQs</p>
          </div>
          <p class="text-[12px] text-text-secondary leading-relaxed"><strong>Delivery:</strong> Orders are delivered in the selected morning slot.</p>
          <p class="text-[12px] text-text-secondary leading-relaxed mt-2"><strong>Payment:</strong> Pay with COD or Razorpay at checkout.</p>
          <p class="text-[12px] text-text-secondary leading-relaxed mt-2"><strong>Track order:</strong> Open My Orders and tap an order to track it.</p>
        </div>

        <a href="mailto:support@instafruit.app" class="bg-white rounded-card p-4 shadow-soft flex items-center gap-3">
          <lucide-icon [img]="MailIcon" [size]="18" class="text-primary"></lucide-icon>
          <div>
            <p class="text-[13px] font-bold text-text-primary">Email us</p>
            <p class="text-[12px] text-text-secondary">support@instafruit.app</p>
          </div>
        </a>

        @if (auth.profile()?.phone) {
          <a [href]="'tel:' + auth.profile()!.phone" class="bg-white rounded-card p-4 shadow-soft flex items-center gap-3">
            <lucide-icon [img]="PhoneIcon" [size]="18" class="text-primary"></lucide-icon>
            <div>
              <p class="text-[13px] font-bold text-text-primary">Call us</p>
              <p class="text-[12px] text-text-secondary">{{ auth.profile()!.phone }}</p>
            </div>
          </a>
        }
      </div>

      <app-bottom-navbar></app-bottom-navbar>
    </div>
  `,
})
export class HelpSupportComponent {
  private readonly location = inject(Location);
  readonly auth = inject(AuthService);
  readonly ChevronIcon = ChevronLeft;
  readonly HelpIcon = HelpCircle;
  readonly MailIcon = Mail;
  readonly PhoneIcon = Phone;
  back(): void { this.location.back(); }
}
