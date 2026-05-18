import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule, ChevronLeft, SlidersHorizontal } from 'lucide-angular';
import { map } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ProductsService } from '../../core/services/products.service';
import { CategoriesService } from '../../core/services/categories.service';
import { ProductCardComponent } from '../../shared/product-card.component';
import { BottomNavbarComponent } from '../../shared/bottom-navbar.component';
import { SearchBarComponent } from '../../shared/search-bar.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ProductCardComponent, BottomNavbarComponent, SearchBarComponent],
  template: `
    <div data-testid="products-page" class="min-h-screen bg-[#FAFAFA] pb-28">
      <div class="sticky top-0 z-30 bg-white px-5 pt-12 pb-4 border-b border-border-soft/50">
        <div class="flex items-center justify-between">
          <button data-testid="back-btn" (click)="back()" class="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
            <lucide-icon [img]="ChevronIcon" [size]="20" class="text-primary"></lucide-icon>
          </button>
          <h1 class="text-[16px] font-extrabold text-text-primary">All Products</h1>
          <button type="button" class="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center opacity-40 cursor-not-allowed" disabled aria-hidden="true" title="Filters coming soon">
            <lucide-icon [img]="FilterIcon" [size]="18" class="text-primary"></lucide-icon>
          </button>
        </div>
        <app-search-bar
          class="mt-3 block"
          [query]="searchQuery()"
          [hint]="productsSearchHint"
          (searchSubmit)="applySearch($event)" />
        <div class="flex gap-2 mt-4 overflow-x-auto no-scrollbar -mx-5 px-5">
          <button [class.bg-primary]="active() === ''" [class.text-white]="active() === ''"
                  [class.bg-primary-light]="active() !== ''" [class.text-primary]="active() !== ''"
                  (click)="selectAll()" class="flex-shrink-0 px-4 py-2 rounded-full text-[12px] font-semibold">All</button>
          @for (cat of categories(); track cat.id) {
            <button [class.bg-primary]="active() === cat.id" [class.text-white]="active() === cat.id"
                    [class.bg-primary-light]="active() !== cat.id" [class.text-primary]="active() !== cat.id"
                    (click)="selectCategory(cat.id)" class="flex-shrink-0 px-4 py-2 rounded-full text-[12px] font-semibold">{{ cat.name }}</button>
          }
        </div>
      </div>

      <div class="px-5 pt-5 grid grid-cols-2 gap-4">
        @for (p of filtered(); track p.id) {
          <app-product-card [product]="p"></app-product-card>
        } @empty {
          <div class="col-span-2 text-center text-[13px] text-text-secondary py-12">
            @if (searchQuery()) {
              No products match “{{ searchQuery() }}”. Try another word or clear the search.
            } @else if (active()) {
              No products in this category.
            } @else {
              No products yet.
            }
          </div>
        }
      </div>

      <app-bottom-navbar></app-bottom-navbar>
    </div>
  `,
})
export class ProductsComponent {
  readonly productsSearchHint =
    'Enter or green button runs search. Matches product name, category, and related words (e.g. kiwi).';

  private readonly destroyRef = inject(DestroyRef);
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productsSvc = inject(ProductsService);
  private readonly catsSvc = inject(CategoriesService);

  readonly products = toSignal(this.productsSvc.list(), { initialValue: [] });
  readonly categories = toSignal(this.catsSvc.list(), { initialValue: [] });
  readonly active = signal<string>('');
  readonly searchQuery = signal<string>('');
  readonly filtered = computed(() => {
    let list = this.products();
    const id = this.active();
    if (id) {
      const cat = this.categories().find((c) => c.id === id);
      list = list.filter(
        (p) => p.categoryId === id || (cat != null && p.categoryName === cat.name),
      );
    }
    const q = this.searchQuery();
    if (q) list = list.filter((p) => ProductsService.matchesSearch(p, q));
    return list;
  });

  readonly ChevronIcon = ChevronLeft;
  readonly FilterIcon = SlidersHorizontal;

  constructor() {
    this.route.queryParamMap
      .pipe(
        map((m) => ({
          categoryId: m.get('category') ?? '',
          search: m.get('search') ?? '',
        })),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ categoryId, search }) => {
        this.active.set(categoryId);
        this.searchQuery.set(search);
      });
  }

  applySearch(raw: string): void {
    const q = raw.trim();
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: q || null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  selectAll(): void {
    this.active.set('');
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  selectCategory(categoryId: string): void {
    this.active.set(categoryId);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: categoryId },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  back(): void { this.location.back(); }
}
