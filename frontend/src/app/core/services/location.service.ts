import { Injectable, inject, signal } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { Address, AppUser } from '../models';
import { AuthService } from './auth.service';

const SESSION_KEY = 'instafruit_location';

interface GeocodeResult {
  locality: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  line1: string;
  formattedAddress: string;
}

interface SessionLocation {
  locality: string;
  city: string;
}

@Injectable({ providedIn: 'root' })
export class LocationService {
  private readonly fns = inject(Functions);
  private readonly auth = inject(AuthService);

  readonly area = signal('Your area');
  readonly loading = signal(false);

  /** Resolve delivery area: saved address → session → GPS. */
  async refresh(forceGps = false): Promise<void> {
    await this.waitForProfile();
    if (!forceGps) {
      const saved = this.auth.profile()?.defaultAddress;
      if (saved) {
        this.area.set(shortAreaFromAddress(saved));
        return;
      }
      const session = readSession();
      if (session?.locality) {
        this.area.set(session.locality);
        return;
      }
    }

    if (!navigator.geolocation) {
      this.area.set('Set location');
      return;
    }

    this.loading.set(true);
    try {
      const coords = await getPosition();
      const fn = httpsCallable<{ lat: number; lng: number }, GeocodeResult>(this.fns, 'reverseGeocode');
      const { data } = await fn({ lat: coords.lat, lng: coords.lng });
      const label = data.locality || data.city || 'Your area';
      this.area.set(label);
      writeSession({ locality: label, city: data.city });
      await this.persist(coords, data);
    } catch {
      if (!readSession()?.locality) this.area.set('Set location');
    } finally {
      this.loading.set(false);
    }
  }
  private async persist(coords: { lat: number; lng: number }, data: GeocodeResult): Promise<void> {
    const uid = this.auth.user()?.uid;
    if (!uid) return;

    const profile = this.auth.profile();
    const lastLocation = {
      lat: coords.lat,
      lng: coords.lng,
      locality: data.locality,
      city: data.city,
      fetchedAt: new Date(),
    };

    const patch: Partial<AppUser> = { lastLocation };
    if (!profile?.defaultAddress) {
      patch.defaultAddress = geocodeToAddress(data, coords);
    }
    await this.auth.updateProfile(uid, patch);
  }

  private async waitForProfile(): Promise<void> {
    if (!this.auth.user()) return;
    for (let i = 0; i < 40 && this.auth.loading(); i++) {
      await new Promise((r) => setTimeout(r, 50));
    }
  }
}

function shortAreaFromAddress(addr: Address): string {
  return addr.locality?.trim() || addr.label?.trim() || addr.city?.trim() || 'Your area';
}

function geocodeToAddress(data: GeocodeResult, coords: { lat: number; lng: number }): Address {
  return {
    label: data.locality || data.city,
    line1: data.line1,
    locality: data.locality,
    city: data.city,
    state: data.state,
    postalCode: data.postalCode,
    country: data.country,
    coordinates: coords,
  };
}

function readSession(): SessionLocation | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SessionLocation) : null;
  } catch {
    return null;
  }
}

function writeSession(loc: SessionLocation): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(loc));
  } catch {
    /* private mode / quota */
  }
}

function getPosition(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
      reject,
      { enableHighAccuracy: false, timeout: 12_000, maximumAge: 300_000 },
    );
  });
}
