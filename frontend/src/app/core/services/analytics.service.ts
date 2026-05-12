import { Injectable, inject } from '@angular/core';
import { Analytics, logEvent } from '@angular/fire/analytics';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly analytics = inject(Analytics, { optional: true });

  track(event: string, params: Record<string, unknown> = {}): void {
    if (this.analytics) logEvent(this.analytics, event, params);
  }
}
