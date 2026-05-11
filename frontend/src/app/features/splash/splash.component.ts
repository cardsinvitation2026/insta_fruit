import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      data-testid="splash-screen"
      class="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style="background:#08B44D;"
    >
      <!-- subtle pattern -->
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-10 left-8 w-20 h-20 rounded-full border-2 border-white/40"></div>
        <div class="absolute top-32 right-12 w-32 h-32 rounded-full border-2 border-white/30"></div>
        <div class="absolute bottom-24 left-12 w-24 h-24 rounded-full border-2 border-white/30"></div>
        <div class="absolute bottom-10 right-8 w-16 h-16 rounded-full border-2 border-white/40"></div>
        <div class="absolute top-1/2 left-1/3 w-10 h-10 rounded-full bg-white/10"></div>
      </div>

      <div class="relative flex flex-col items-center animate-fade-in">
        <div class="w-28 h-28 bg-white rounded-[32px] flex items-center justify-center shadow-2xl mb-6 rotate-3">
          <span class="text-6xl">🥝</span>
        </div>
        <h1 class="text-white text-4xl font-extrabold tracking-tight">InstaFruit</h1>
        <p class="text-white/80 text-sm font-medium mt-2">Fresh fruits, delivered fast</p>

        <div class="mt-12 flex gap-1.5">
          <span class="w-2 h-2 rounded-full bg-white/90 animate-pulse"></span>
          <span class="w-2 h-2 rounded-full bg-white/60 animate-pulse [animation-delay:150ms]"></span>
          <span class="w-2 h-2 rounded-full bg-white/40 animate-pulse [animation-delay:300ms]"></span>
        </div>
      </div>
    </div>
  `,
})
export class SplashComponent implements OnInit {
  private readonly router = inject(Router);
  ngOnInit(): void {
    setTimeout(() => this.router.navigate(['/login']), 2000);
  }
}
