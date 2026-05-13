import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Search, SlidersHorizontal } from 'lucide-angular';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="flex items-center gap-3" data-testid="search-bar">
      <div class="flex-1 flex items-center gap-3 bg-white rounded-input px-4 h-12 shadow-soft border border-border-soft/60">
        <lucide-icon [img]="SearchIcon" [size]="18" class="text-text-secondary"></lucide-icon>
        <input
          type="text"
          [placeholder]="placeholder()"
          data-testid="search-input"
          class="flex-1 bg-transparent outline-none text-sm placeholder:text-text-secondary"
        />
      </div>
      <button
        type="button"
        data-testid="filter-btn"
        class="w-12 h-12 bg-primary text-white rounded-input flex items-center justify-center shadow-green"
      >
        <lucide-icon [img]="FilterIcon" [size]="18"></lucide-icon>
      </button>
    </div>
  `,
})
export class SearchBarComponent {
  readonly placeholder = input<string>('Search for fruits, berries…');
  readonly SearchIcon = Search;
  readonly FilterIcon = SlidersHorizontal;
}
