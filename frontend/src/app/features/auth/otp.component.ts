import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, Phone, KeyRound, AlertCircle } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  template: `
    <div data-testid="otp-page" class="min-h-screen w-full flex flex-col" style="background:#08B44D;">
      <div class="flex-shrink-0 px-6 pt-14 pb-8 text-white">
        <div class="w-16 h-16 bg-white/15 backdrop-blur rounded-2xl flex items-center justify-center mb-5">
          <span class="text-3xl">📱</span>
        </div>
        <h1 class="text-3xl font-extrabold leading-tight">Phone OTP<br/>Sign In</h1>
        <p class="text-white/85 text-sm mt-2">We'll send a 6-digit code to verify.</p>
      </div>

      <div class="flex-1 bg-white px-6 pt-8 pb-10 animate-slide-up" style="border-top-left-radius:40px; border-top-right-radius:40px;">
        @if (step() === 'phone') {
          <div class="space-y-4">
            <div class="bg-[#F7F7F7] rounded-input px-4 h-14 flex items-center gap-3">
              <lucide-icon [img]="PhoneIcon" [size]="18" class="text-text-secondary"></lucide-icon>
              <input data-testid="otp-phone" type="tel" [(ngModel)]="phone"
                     placeholder="+91 9876543210" class="flex-1 bg-transparent outline-none text-sm" />
            </div>
            @if (error()) {
              <div class="bg-red-50 text-red-600 rounded-input px-4 py-3 text-[12px] font-medium flex items-center gap-2">
                <lucide-icon [img]="AlertIcon" [size]="14"></lucide-icon>{{ error() }}
              </div>
            }
            <button data-testid="otp-send" (click)="sendCode()" [disabled]="loading()"
                    class="w-full h-14 bg-primary text-white rounded-btn text-[15px] font-bold shadow-green disabled:opacity-60">
              {{ loading() ? 'Sending…' : 'Send OTP' }}
            </button>
            <div id="otp-recaptcha" class="hidden"></div>
          </div>
        } @else {
          <div class="space-y-4">
            <div class="bg-[#F7F7F7] rounded-input px-4 h-14 flex items-center gap-3">
              <lucide-icon [img]="KeyIcon" [size]="18" class="text-text-secondary"></lucide-icon>
              <input data-testid="otp-code" type="text" maxlength="6" [(ngModel)]="code"
                     placeholder="6-digit code" class="flex-1 bg-transparent outline-none text-sm tracking-[0.4em] font-bold" />
            </div>
            @if (error()) {
              <div class="bg-red-50 text-red-600 rounded-input px-4 py-3 text-[12px] font-medium flex items-center gap-2">
                <lucide-icon [img]="AlertIcon" [size]="14"></lucide-icon>{{ error() }}
              </div>
            }
            <button data-testid="otp-verify" (click)="verify()" [disabled]="loading()"
                    class="w-full h-14 bg-primary text-white rounded-btn text-[15px] font-bold shadow-green disabled:opacity-60">
              {{ loading() ? 'Verifying…' : 'Verify & Continue' }}
            </button>
            <button (click)="step.set('phone')" class="w-full text-center text-[13px] text-text-secondary">Change number</button>
          </div>
        }

        <p class="text-center text-[13px] text-text-secondary mt-6">
          Use email instead?
          <a routerLink="/login" class="text-primary font-semibold ml-1">Sign In</a>
        </p>
      </div>
    </div>
  `,
})
export class OtpComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  step = signal<'phone' | 'code'>('phone');
  phone = '';
  code = '';
  loading = signal(false);
  error = signal('');
  readonly PhoneIcon = Phone; readonly KeyIcon = KeyRound; readonly AlertIcon = AlertCircle;

  async sendCode(): Promise<void> {
    if (!/^\+\d{10,15}$/.test(this.phone.trim())) {
      this.error.set('Enter phone in E.164 format e.g. +919876543210'); return;
    }
    this.loading.set(true); this.error.set('');
    try {
      await this.auth.sendOtp(this.phone.trim(), 'otp-recaptcha');
      this.step.set('code');
    } catch (e) { this.error.set((e as Error)?.message ?? 'Failed to send OTP'); }
    finally { this.loading.set(false); }
  }

  async verify(): Promise<void> {
    if (this.code.trim().length !== 6) { this.error.set('Enter 6-digit code'); return; }
    this.loading.set(true); this.error.set('');
    try {
      await this.auth.verifyOtp(this.code.trim());
      this.router.navigate(['/home']);
    } catch (e) { this.error.set((e as Error)?.message ?? 'Invalid code'); }
    finally { this.loading.set(false); }
  }
}
