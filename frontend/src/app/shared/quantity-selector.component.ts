import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Minus, Plus } from 'lucide-angular';

@Component({
  selector: 'app-quantity-selector',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="inline-flex items-center gap-3 bg-white rounded-full border border-border-soft px-2 py-1.5 shadow-soft">
      <button
        data-testid="qty-decrement"
        type="button"
        (click)="dec.emit()"
        class="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center active:scale-95"
      >
        <lucide-icon [img]="MinusIcon" [size]="16"></lucide-icon>
      </button>
      <span data-testid="qty-value" class="text-[15px] font-bold w-6 text-center">{{ value() }}</span>
      <button
        data-testid="qty-increment"
        type="button"
        (click)="inc.emit()"
        class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center active:scale-95"
      >
        <lucide-icon [img]="PlusIcon" [size]="16"></lucide-icon>
      </button>
    </div>
  `,
})
export class QuantitySelectorComponent {
  readonly value = input.required<number>();
  readonly inc = output<void>();
  readonly dec = output<void>();
  readonly MinusIcon = Minus;
  readonly PlusIcon = Plus;
}
