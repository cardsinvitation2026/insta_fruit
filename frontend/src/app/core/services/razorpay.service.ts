/**
 * Razorpay browser checkout integration.
 * The script is lazily injected once on first use.
 */
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

declare global {
  interface Window { Razorpay?: new (options: RazorpayOptions) => RazorpayInstance; }
}

interface RazorpayOptions {
  key: string;
  amount: number; // paise
  currency: 'INR';
  name: string;
  description?: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (resp: RazorpaySuccess) => void;
  modal?: { ondismiss?: () => void };
}
interface RazorpayInstance { open: () => void; }
export interface RazorpaySuccess {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

@Injectable({ providedIn: 'root' })
export class RazorpayService {
  private readonly auth = inject(AuthService);
  private scriptLoaded = false;

  private loadScript(): Promise<void> {
    if (this.scriptLoaded) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload = () => { this.scriptLoaded = true; resolve(); };
      s.onerror = () => reject(new Error('Failed to load Razorpay'));
      document.head.appendChild(s);
    });
  }

  async openCheckout(input: {
    razorpayOrderId: string;
    amountInr: number;
    orderId: string;
  }): Promise<RazorpaySuccess> {
    await this.loadScript();
    if (!window.Razorpay) throw new Error('Razorpay SDK unavailable');
    const profile = this.auth.profile();
    return new Promise<RazorpaySuccess>((resolve, reject) => {
      const rzp = new window.Razorpay!({
        key: environment.razorpayKeyId,
        amount: Math.round(input.amountInr * 100),
        currency: 'INR',
        name: 'InstaFruit',
        description: `Order ${input.orderId}`,
        order_id: input.razorpayOrderId,
        prefill: {
          name: profile?.fullName ?? '',
          email: profile?.email ?? '',
          contact: profile?.phone ?? '',
        },
        theme: { color: '#08B44D' },
        handler: (resp) => resolve(resp),
        modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
      });
      rzp.open();
    });
  }
}
