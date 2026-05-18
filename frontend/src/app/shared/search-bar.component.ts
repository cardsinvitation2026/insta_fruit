import { Component, effect, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Search, SlidersHorizontal } from 'lucide-angular';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="flex flex-col gap-1" data-testid="search-bar">
      <div class="flex items-center gap-3">
        <div class="flex-1 flex items-center gap-3 bg-white rounded-input px-4 h-12 shadow-soft border border-border-soft/60">
          <lucide-icon [img]="SearchIcon" [size]="18" class="text-text-secondary"></lucide-icon>
          <input
            type="text"
            [placeholder]="placeholder()"
            [value]="draft()"
            (input)="onInput($event)"
            (keydown.enter)="submit()"
            autocomplete="off"
            data-testid="search-input"
            class="flex-1 bg-transparent outline-none text-sm placeholder:text-text-secondary"
          />
        </div>
        <button
          type="button"
          data-testid="filter-btn"
          (click)="submit()"
          [attr.aria-label]="'Search products'"
          class="w-12 h-12 bg-primary text-white rounded-input flex items-center justify-center shadow-green"
        >
          <lucide-icon [img]="FilterIcon" [size]="18"></lucide-icon>
        </button>
      </div>
      @if (hint()) {
        <p class="text-[11px] text-text-secondary px-0.5 leading-snug">{{ hint() }}</p>
      }
    </div>
  `,
})
export class SearchBarComponent {
  /** Synced from route / parent when navigation changes */
  readonly initialQuery = input<string>('', { alias: 'query' });
  readonly placeholder = input<string>('Search for fruits, berries…');
  /** Short usage line under the field (e.g. on Home). */
  readonly hint = input<string>('');

  readonly searchSubmit = output<string>();

  readonly SearchIcon = Search;
  readonly FilterIcon = SlidersHorizontal;

  /** Local text while typing; reset when `query` input changes. */
  protected readonly draft = signal('');

  constructor() {
    effect(() => {
      this.draft.set(this.initialQuery());
    });
  }

  protected onInput(event: Event): void {
    this.draft.set((event.target as HTMLInputElement).value);
  }

  submit(): void {
    this.searchSubmit.emit(this.draft().trim());
  }
}
