import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, Mail, Lock, User, Eye, EyeOff } from 'lucide-angular';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  template: `
    <div data-testid="signup-page" class="min-h-screen w-full flex flex-col" style="background:#08B44D;">
      <!-- Top green section -->
      <div class="flex-shrink-0 px-6 pt-14 pb-8 text-white">
        <div class="w-16 h-16 bg-white/15 backdrop-blur rounded-2xl flex items-center justify-center mb-5">
          <span class="text-3xl">🥝</span>
        </div>
        <h1 class="text-3xl font-extrabold leading-tight">Create your<br/>account</h1>
        <p class="text-white/85 text-sm mt-2">Join InstaFruit and get fresh fruits delivered.</p>
      </div>

      <!-- Bottom white card -->
      <div class="flex-1 bg-white px-6 pt-8 pb-10 animate-slide-up" style="border-top-left-radius:40px; border-top-right-radius:40px;">
        <form (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="bg-[#F7F7F7] rounded-input px-4 h-14 flex items-center gap-3">
            <lucide-icon [img]="UserIcon" [size]="18" class="text-text-secondary"></lucide-icon>
            <input
              data-testid="signup-name"
              name="name"
              type="text"
              [(ngModel)]="name"
              placeholder="Full Name"
              class="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
          <div class="bg-[#F7F7F7] rounded-input px-4 h-14 flex items-center gap-3">
            <lucide-icon [img]="MailIcon" [size]="18" class="text-text-secondary"></lucide-icon>
            <input
              data-testid="signup-email"
              name="email"
              type="email"
              [(ngModel)]="email"
              placeholder="Email Address"
              class="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
          <div class="bg-[#F7F7F7] rounded-input px-4 h-14 flex items-center gap-3">
            <lucide-icon [img]="LockIcon" [size]="18" class="text-text-secondary"></lucide-icon>
            <input
              data-testid="signup-password"
              name="password"
              [type]="showPwd() ? 'text' : 'password'"
              [(ngModel)]="password"
              placeholder="Password"
              class="flex-1 bg-transparent outline-none text-sm"
            />
            <button type="button" (click)="showPwd.set(!showPwd())" class="text-text-secondary">
              <lucide-icon [img]="showPwd() ? EyeOffIcon : EyeIcon" [size]="18"></lucide-icon>
            </button>
          </div>

          <button
            type="submit"
            data-testid="signup-submit"
            class="w-full h-14 bg-primary text-white rounded-btn text-[15px] font-bold shadow-green active:scale-[0.98]"
          >Sign Up</button>
        </form>

        <div class="flex items-center gap-3 my-6">
          <div class="flex-1 h-px bg-border-soft"></div>
          <span class="text-[11px] text-text-secondary font-medium">or continue with</span>
          <div class="flex-1 h-px bg-border-soft"></div>
        </div>

        <button
          type="button"
          data-testid="signup-google"
          (click)="onSubmit()"
          class="w-full h-14 bg-white border border-border-soft rounded-btn flex items-center justify-center gap-3 text-[14px] font-semibold text-text-primary"
        >
          <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4.5 24 4.5 13 4.5 4.5 13 4.5 24S13 43.5 24 43.5 43.5 35 43.5 24c0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4.5 24 4.5 16.3 4.5 9.7 8.7 6.3 14.7z"/><path fill="#4CAF50" d="M24 43.5c5.4 0 10.3-2.1 14-5.4l-6.5-5.3c-2 1.5-4.6 2.4-7.5 2.4-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.5 39.2 16.2 43.5 24 43.5z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.5l6.5 5.3C41.1 35.5 43.5 30.2 43.5 24c0-1.2-.1-2.3.1-3.5z"/></svg>
          Continue with Google
        </button>

        <p class="text-center text-[13px] text-text-secondary mt-6">
          Already have an account?
          <a routerLink="/login" data-testid="goto-login" class="text-primary font-semibold ml-1">Sign In</a>
        </p>
      </div>
    </div>
  `,
})
export class SignupComponent {
  private readonly router = inject(Router);
  name = '';
  email = '';
  password = '';
  showPwd = signal(false);
  readonly MailIcon = Mail;
  readonly LockIcon = Lock;
  readonly UserIcon = User;
  readonly EyeIcon = Eye;
  readonly EyeOffIcon = EyeOff;

  onSubmit() {
    this.router.navigate(['/home']);
  }
}
